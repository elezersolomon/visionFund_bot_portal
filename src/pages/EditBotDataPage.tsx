import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import { getBotData } from "../services/api";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux";
import { botData } from "../models";
import { Content } from "../models";
import { updateBotData } from "../services/api";
import NotificationModal from "../components/NotificationModal";
import DeleteIcon from "@mui/icons-material/Delete";

const EditBotData: React.FC = () => {
  const [botData, setBotData] = useState<botData[]>([]);
  const token = useSelector((state: RootState) => state.user.token);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [newFaq, setNewFaq] = useState<{ question: string; answer: string }>({
    question: "",
    answer: "",
  });
  const [newSavingProduct, setNewSavingProduct] = useState({
    name: "",
    details: "",
  });
  const [newLoanProduct, setNewLoanProduct] = useState({
    name: "",
    details: "",
  });

  function setProductData(category: string, target: any) {
    if (target.name == "name") {
      if (category == "loanProducts")
        setNewLoanProduct((prev) => ({
          ...prev,
          name: target.value,
        }));
      else if (category == "savingProducts")
        setNewSavingProduct((prev) => ({ ...prev, name: target.value }));
    }

    if (target.name == "details") {
      if (category == "loanProducts")
        setNewLoanProduct((prev) => ({
          ...prev,
          details: target.value,
        }));
      else if (category == "savingProducts")
        setNewSavingProduct((prev) => ({ ...prev, details: target.value }));
    }
  }

  useEffect(() => {
    const fetchBotData = async () => {
      try {
        const initialData = await getBotData(token);
        setBotData(initialData);
      } catch (error) {
        console.error("Error fetching bot data:", error);
      }
    };
    fetchBotData();
  }, [token]);

  const handleInputChange = (
    description: string,
    key: string,
    value: string
  ) => {
    setBotData((prevData) =>
      prevData.map((item) =>
        item.description === description
          ? {
              ...item,
              content: {
                ...item.content,
                [key]: value,
              },
            }
          : item
      )
    );
  };

  const handleNestedInputChange = (
    description: string,
    category: string,
    key: string,
    value: string
  ) => {
    setBotData((prevData) =>
      prevData.map((item) =>
        item.description === description
          ? {
              ...item,
              content: {
                ...item.content,
                [category]: {
                  ...(item.content[category] as Content),
                  [key]: value,
                },
              },
            }
          : item
      )
    );
  };

  const handleFaqChange = (description: string, key: string, value: string) => {
    setBotData((prevData) =>
      prevData.map((item) =>
        item.description === description
          ? {
              ...item,
              content: {
                ...item.content,
                FAQList: {
                  ...(item.content.FAQList as Record<string, string>),
                  [key]: value,
                },
              },
            }
          : item
      )
    );
  };

  const addNewFaq = async (description: string) => {
    setBotData((prevData) =>
      prevData.map((item) =>
        item.description === description
          ? {
              ...item,
              content: {
                ...item.content,
                FAQList: {
                  ...(item.content.FAQList as Record<string, string>),
                  [newFaq.question]: newFaq.answer,
                },
              },
            }
          : item
      )
    );

    const currentData = await botData.map((item) =>
      item.description === description
        ? {
            ...item,
            content: {
              ...item.content,
              FAQList: {
                ...(item.content.FAQList as Record<string, string>),
                [newFaq.question]: newFaq.answer,
              },
            },
          }
        : item
    );
    setBotData(currentData);

    let items: any;
    currentData.map((item) => {
      if (item.description == description) {
        items = item;
      }
    });

    const onSaveResponse = await updateBotData(
      token,
      items.content,
      items.description
    );

    setMessage(`FAQ has been added successfully`);
    setMessageType(onSaveResponse.status);
    setModalOpen(true);
    setNewFaq({ question: "", answer: "" });
  };

  const addProduct = async (
    description: string,
    category: string,
    item: any
  ) => {
    let newProduct: any = {
      name: "",
      details: "",
    };
    let setProduct: any = "";
    if (category == "loanProducts") {
      newProduct = newLoanProduct;
      setProduct = setNewLoanProduct;
    } else if (category == "savingProducts") {
      setProduct = setNewSavingProduct;
      newProduct = newSavingProduct;
    }

    const currentData = await botData.map((item) =>
      item.description === description
        ? {
            ...item,
            content: {
              ...item.content,
              [category]: {
                ...(item.content[category] as Record<string, string>),
                [newProduct.name]: newProduct.details,
              },
            },
          }
        : item
    );
    setBotData(currentData);

    let items: any;
    currentData.map((item) => {
      if (item.description == description) {
        items = item;
      }
    });

    const onSaveResponse = await updateBotData(
      token,
      items.content,
      item.description
    );

    setMessage(`Product has been added successfully`);
    setMessageType(onSaveResponse.status);
    setModalOpen(true);
    setProduct({ name: "", details: "" });
  };

  const saveChangesForItem = async (item: botData) => {
    const onSaveResponse = await updateBotData(
      token,
      item.content,
      item.description
    );
    const onclose = () => {
      setAnchorEl(null);
    };
    setMessage(onSaveResponse.message);
    setMessageType(onSaveResponse.status);
    setModalOpen(true);
  };

  const handleDelete = async (
    description: string,
    category: string,
    key: string
  ) => {
    const updatedData = botData.map((item) =>
      item.description === description
        ? {
            ...item,
            content: {
              ...item.content,
              [category]: Object.keys(item.content[category] || {})
                .filter((productKey) => productKey !== key)
                .reduce(
                  (acc, curr) => ({
                    ...acc,
                    [curr]: (item.content[category] as Record<string, string>)[
                      curr
                    ],
                  }),
                  {}
                ),
            },
          }
        : item
    );

    setBotData(updatedData);

    const itemToSave = updatedData.find(
      (item) => item.description === description
    );
    if (itemToSave) {
      const onSaveResponse = await updateBotData(
        token,
        itemToSave.content,
        itemToSave.description
      );
      setMessage(`FAQ has been deleted successfully`);
      setMessageType(onSaveResponse.status);
      setModalOpen(true);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography textAlign="center" variant="h4" gutterBottom>
        Edit Bot Data
      </Typography>
      {botData.map((item) => (
        <Paper key={item.id} sx={{ padding: 5, margin: 3 }}>
          <Box sx={{ textAlign: "center", marginBottom: 2 }}>
            <Typography variant="h5">{item.description}</Typography>
          </Box>

          {item.description === "About Us" &&
            Object.entries(item.content).map(([key, value]) => (
              <TextField
                key={key}
                label={key}
                value={value as string}
                onChange={(e) =>
                  handleInputChange(item.description, key, e.target.value)
                }
                multiline
                rows={6}
                fullWidth
                margin="normal"
              />
            ))}

          {item.description === "Contact Us" &&
            Object.entries(item.content).map(([key, value]) => (
              <TextField
                key={key}
                label={key}
                value={value as string}
                onChange={(e) =>
                  handleInputChange(item.description, key, e.target.value)
                }
                fullWidth
                margin="normal"
              />
            ))}

          {item.description === "products" &&
            ["savingProducts", "loanProducts"].map((category) => (
              <Box key={category} sx={{ marginBottom: 3 }}>
                <Paper key={item.id} sx={{ padding: 5, margin: 3 }}>
                  <Typography variant="h6">{category}</Typography>
                  {Object.entries(item.content[category] || {}).map(
                    ([key, value]) => (
                      <Stack
                        key={key}
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        sx={{ marginBottom: 2, marginTop: 3 }}
                      >
                        <TextField
                          key={key}
                          label={key}
                          value={value as string}
                          onChange={(e) =>
                            handleNestedInputChange(
                              item.description,
                              category,
                              key,
                              e.target.value
                            )
                          }
                          multiline
                          fullWidth
                          margin="normal"
                        />
                        <IconButton
                          onClick={() =>
                            handleDelete(item.description, category, key)
                          }
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    )
                  )}

                  <Box sx={{ marginTop: 3 }}>
                    <Typography variant="h6">Add New {category}</Typography>
                    <TextField
                      name="name"
                      label="Product Name"
                      value={
                        category === "loanProducts"
                          ? newLoanProduct.name
                          : newSavingProduct.name
                      }
                      onChange={(e) => setProductData(category, e.target)}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      name="details"
                      label="Product Detail"
                      value={
                        category === "loanProducts"
                          ? newLoanProduct.details
                          : newSavingProduct.details
                      }
                      onChange={(e) => setProductData(category, e.target)}
                      multiline
                      rows={3}
                      fullWidth
                      margin="normal"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        addProduct(item.description, category, item)
                      }
                      disabled={
                        category === "loanProducts"
                          ? !newLoanProduct.name || !newLoanProduct.name
                          : !newSavingProduct.name || !newSavingProduct.details
                      }
                    >
                      Add {category}
                    </Button>
                  </Box>
                </Paper>
              </Box>
            ))}

          {item.description === "FAQs" && (
            <>
              {/* Existing FAQs */}
              {Object.entries(item.content.FAQList || {}).map(
                ([key, value]) => (
                  <Stack
                    key={key}
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{ marginBottom: 2 }}
                  >
                    <TextField
                      key={key}
                      label={`Question: ${key}`}
                      value={value as string}
                      onChange={(e) =>
                        handleFaqChange(item.description, key, e.target.value)
                      }
                      multiline
                      rows={3}
                      fullWidth
                      margin="normal"
                    />
                    <IconButton
                      onClick={() =>
                        handleDelete(item.description, "FAQList", key)
                      }
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                )
              )}

              {/* Add New FAQ */}
              <Box sx={{ marginTop: 3 }}>
                <Typography variant="h6">Add New FAQ</Typography>
                <TextField
                  label="Question"
                  value={newFaq.question}
                  onChange={(e) =>
                    setNewFaq((prev) => ({ ...prev, question: e.target.value }))
                  }
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Answer"
                  value={newFaq.answer}
                  onChange={(e) =>
                    setNewFaq((prev) => ({ ...prev, answer: e.target.value }))
                  }
                  multiline
                  rows={3}
                  fullWidth
                  margin="normal"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => addNewFaq(item.description)}
                  disabled={!newFaq.question || !newFaq.answer}
                >
                  Add FAQ
                </Button>
              </Box>
            </>
          )}

          <Stack
            direction="row"
            justifyContent="flex-end"
            sx={{ marginTop: 2 }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => saveChangesForItem(item)}
            >
              Save Changes
            </Button>
          </Stack>
        </Paper>
      ))}

      <Stack
        direction="row"
        justifyContent="flex-end"
        sx={{ marginTop: 4 }}
      ></Stack>
      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        message={message!}
        messageType={messageType}
      />
    </Box>
  );
};

export default EditBotData;
function setAnchorEl(arg0: null) {
  throw new Error("Function not implemented.");
}
