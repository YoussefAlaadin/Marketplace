// VendorDashboard.jsx
import { useState } from "react";
import ProductCard from "./components/ProductCard";
import Modal from "./components/ui/Modal";
import { categories, formInputsList, productList } from "./data";
import Button from "./components/ui/Button";
import Input from "./components/ui/Input";
import productValidation from "./validation";
import ErrorMsg from "./components/ErrorMsg";
import SelectMenu from "./components/ui/SelectMenu";
import axios from "axios";

function VendorDashboard() {
  const defaultProductObj = {
    title: "",
    description: "",
    imageURL: "",
    price: 0,
    category: "",
    units: 0,
  };

  const defaultErrorObj = {
    title: "",
    description: "",
    imageURL: "",
    price: "",
  };

  const [products, setProducts] = useState(productList);
  const [productAdd, setProductADD] = useState(defaultProductObj);
  const [productToEdit, setProductToEdit] = useState(defaultProductObj);
  const [productToEditIdx, setProductToEditIdx] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState(defaultErrorObj);
  const [isError, setIsError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const openEditModal = () => setIsEdit(true);
  const closeEditModal = () => setIsEdit(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const onChangeEventHandler = (event) => {
    const { name, value } = event.target;

    const newValue = (name === "price" || name === "units") ? Number(value) : value;

  setProductADD({
    ...productAdd,
    [name]: newValue,
    category: selectedCategory.name,
  });

  if (isError) {
    setErrors({
      ...errors,
      [name]: productValidation({ ...productAdd, [name]: newValue })[name],
    });
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const onChangeEditHandler = (event) => {
    const { name, value } = event.target;
    const newValue = (name === "price" || name === "units") ? Number(value) : value;

    setProductToEdit({
      ...productToEdit,
      [name]: newValue,
    });

    if (isError) {
      setErrors({
        ...errors,
        [name]: productValidation({ ...productToEdit, [name]: newValue })[name],
      });
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const errors = productValidation(productAdd);
    const hasNoError = Object.values(errors).every((error) => error === "");

    if (hasNoError) {
      try {
        const token = localStorage.getItem("token");

        const addData = {
          title: productAdd.title,
          description: productAdd.description,
          imageURL: productAdd.imageURL,
          price: Number(productAdd.price),
          category: productAdd.category,
          units: Number(productAdd.units),
        };

        const response = await axios.post(
          "http://localhost:5024/api/Vendor/addproduct",  //** ADD API LINK HERE **/
          addData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        alert("Product added successfully!");
        console.log(response.data);
      } catch (err) {
        console.error(err);
        alert("Failed to add product");
      }

      setProductADD(defaultProductObj);
      setErrors(defaultErrorObj);
      console.log("Product added successfully!", productAdd); 

      closeModal();
    } else {
      setErrors(errors);
      setIsError(true);
    }
  };

  const submitEditHandler = (event) => {
    event.preventDefault();
    const errors = productValidation(productToEdit);
    const hasNoError = Object.values(errors).every((error) => error === "");

    if (hasNoError) {
      const updatedProducts = [...products];
      updatedProducts[productToEditIdx] = productToEdit;
      setProducts(updatedProducts);
      setProductToEdit(defaultProductObj);
      console.log("Product updated successfully!", productToEdit);
      console.log("Updated products:", updatedProducts);
      closeEditModal();
    } else {
      setErrors(errors);
      setIsError(true);
    }
  };

  const onCancelHandler = () => {
    setProductADD(defaultProductObj);
    setErrors(defaultErrorObj);
    setIsError(false);
    closeModal();
  };

  const renderProductList = products.map((product, idx) => (
    <ProductCard
      product={product}
      key={product.id}
      setProductToEdit={setProductToEdit}
      setIsEdit={setIsEdit}
      openEditModal={openEditModal}
      idx={idx}
      setProductToEditIdx={setProductToEditIdx}
    />
  ));

  const renderEditProduct = ({ id, label, name }) => (
    <div key={id} className="flex flex-col mb">
      <label htmlFor="{id}">{label}</label>
      <Input
        name={name}
        id={id}
        value={productToEdit[name]}
        onChange={onChangeEditHandler}
      />
      <ErrorMsg msg={errors[name]} />
    </div>
  );

  const renderFromInputList = formInputsList.map((input) => (
    <div key={input.id} className="flex flex-col mb">
      <label htmlFor={input.id}>{input.label}</label>
      <Input 
        name={input.name}
        id={input.id}
        type={input.type}
        value={(productAdd[input.name]=== 0 ? "" : productAdd[input.name])}
        onChange={onChangeEventHandler}
      />
      <ErrorMsg msg={errors[input.name]} />
    </div>
  ));

  return (
    <main className="container mx-auto px-20">
      <Button className="bg-violet-700" onClick={openModal}>ADD ITEM</Button>

      <div className="m-5 p-2 gap-5 rounded-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {renderProductList}
      </div>

      <Modal isOpen={isOpen} close={closeModal} onSubmit={submitHandler} title="ADD NEW PRODUCT">
        <form onSubmit={submitHandler}>
          {renderFromInputList}
          <SelectMenu selected={selectedCategory} setSelected={setSelectedCategory} />
          <div className="flex items-center space-x-2.5 mt-5">
            <Button className=" bg-violet-700">Submit</Button>
            <Button onClick={onCancelHandler} className="bg-gray-700">Cancel</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEdit} close={closeEditModal} onSubmit={submitHandler} title="EDIT PRODUCT">
        {renderEditProduct({ id: "title", label: "Product Title", name: "title" })}
        {renderEditProduct({ id: "description", label: "Product Description", name: "description" })}
        {renderEditProduct({ id: "imageURL", label: "Product Image URL", name: "imageURL" })}
        {renderEditProduct({ id: "price", label: "Product Price", name: "price" })}
        {renderEditProduct({ id: "units", label: "Product Units", name: "units" })}

        <div className="flex items-center space-x-2.5 mt-5">
          <Button onClick={submitEditHandler} className="bg-violet-700">Edit</Button>
          <Button onClick={closeEditModal} className="bg-gray-700">Cancel</Button>
        </div>
      </Modal>
    </main>
  );
}

export default VendorDashboard;
