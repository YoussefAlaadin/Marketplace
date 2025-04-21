import { useState } from "react";
import ProductCard from "./components/ProductCard";
import Modal from "./components/ui/Modal";
import { categories, formInputsList, productList } from "./data";
import Button from "./components/ui/Button";
import Input from "./components/ui/Input";
import productValidation from "./validation";
import ErrorMsg from "./components/ErrorMsg";
import { v4 as uuid } from "uuid";
import SelectMenu from "./components/ui/SelectMenu";

function App() {
  //      ** State**     //
  const defaultProductObj = {
    title: "",
    description: "",
    imageURL: "",
    price: "",
    category: {
      name: "",
      imageURL: "",
    },
  };
  const defaultErrorObj = {
    title: "",
    description: "",
    imageURL: "",
    price: "",
  };

  const [products, setProducts] = useState(productList);
  const [product, setProduct] = useState(defaultProductObj);
  const [productToEdit, setProductToEdit] = useState(defaultProductObj);
  //const [productToEditIdx, setProductToEditIdx] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState(defaultErrorObj);
  const [isError, setIsError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
 // console.log(productToEditIdx);
 // console.log(isEdit);
  //      ** Handler**     //

  function openEditModal() {
    setIsEdit(true);
  }
  function closeEditModal() {
    setIsEdit(false);
  }
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const onChangeEventHandler = (event) => {
    const { name, value } = event.target;
    setProduct({
      ...product,
      [name]: value,
    });
    if (isError) {
      setErrors({
        ...errors,
        [name]: productValidation({ ...product, [name]: value })[
          name
        ], //updates the error message while typing
      });
    } else {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };
  const onChangeEditHandler = (event) => {
    const { name, value } = event.target;
    setProductToEdit({
      ...productToEdit,
      [name]: value,
    });

    if (isError) {
      setErrors({
        ...errors,
        [name]: productValidation(
          { ...productToEdit, [name]: value },
        )[name], //updates the error message while typing
      });
    } else {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const errors = productValidation(product);
    //** Check if one of the errors has "" && if all the errors have ""**/
    const hasNoError =
      Object.values(errors).some((error) => error === "") &&
      Object.values(errors).every((error) => error === "");

    if (hasNoError) {
      setProducts((prev) => [
        {
          ...product,
          id: uuid(),
          category: selectedCategory,
        },
        ...prev,
      ]);
      console.log("productToAdd:", product);
      console.log("Product submitted");
      console.log("Products: ", [products]);
      setProduct(defaultProductObj);
      setErrors(defaultErrorObj);
      closeModal();
    } else {
      setErrors(errors);
      setIsError(true);
    }
  };
  // const submitEditHandler = (event) => {
  //   event.preventDefault();

  //    const { title, description, price, imageURL } = productToEdit;

  //   const errors = productValidation({productToEdit});
  //   const errors = productValidation(
  //     {
  //       title,
  //       description,
  //       price,
  //       imageURL,
  //     },
  //   );
  //   //** Check if one of the errors has "" && if all the errors have ""**/
  //   const hasNoError =
  //     Object.values(errors).some((error) => error === "") &&
  //     Object.values(errors).every((error) => error === "");

  //   // const hasErrorMsg = Object.values(errors).some((value) => value === "") && Object.values(errors).every((value) => value === "");

  //  // if (hasNoError) {
  //     const updatedProducts = [...products];
  //     updatedProducts[productToEditIdx] = productToEdit;
  //     setProducts(updatedProducts);

  //     setProductToEdit(defaultProductObj);
  //     closeEditModal();
  //     return;
  //   // } else {
  //   //   setErrors(errors);
  //   //   setIsError(true);
  //   //   //console.log(errors);
  //   // }
  // };

  const onCancelHandler = () => {
    setProduct(defaultProductObj);
    setErrors(defaultErrorObj);
    setIsError(false);
    closeModal();
  };

  //      ** Renders **     //

  const renderProductList = products.map((product, idx) => (
    <ProductCard
      product={product}
      key={product.id}
      setProductToEdit={setProductToEdit}
      setIsEdit={setIsEdit}
      openEditModal={openEditModal}
      idx={idx}
      //setProductToEditIdx={setProductToEditIdx}
    />
  ));

  const renderEditProduct = ({ id, label, name }) => {
    return (
      <div key={id} className="flex flex-col mb">
        <label htmlFor="">{label}</label>
        <Input
          name={name}
          id={id}
          value={productToEdit[name]}
          onChange={onChangeEditHandler}
        />
        {/** Controlled Component*/}
        <ErrorMsg msg={errors[name]} />
      </div>
    );
  };

  const renderFromInputList = formInputsList.map((input) => (
    <div key={input.id} className="flex flex-col mb">
      <label htmlFor="">{input.label}</label>
      <Input
        name={input.name}
        id={input.id}
        value={product[input.name]}
        onChange={onChangeEventHandler}
      />
      {/** Controlled Component*/}
      <ErrorMsg msg={errors[input.name]} />
    </div>
  ));


  return (
    <main className="container mx-auto px-20">
      <Button className="bg-violet-700" onClick={openModal}>
        ADD ITEM
      </Button>
      <div className="m-5 p-2 gap-5 rounded-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {renderProductList}
      </div>
      {/* Add New Item */}
      <Modal
        isOpen={isOpen}
        close={closeModal}
        onSubmit={submitHandler}
        title="ADD NEW PRODUCT"
      >
        {renderFromInputList}
        <SelectMenu
          selected={selectedCategory}
          setSelected={setSelectedCategory}
        />
        
        
        <div className="flex items-center space-x-2.5 mt-5">
          <Button onClick={submitHandler} className="bg-violet-700">
            Submit
          </Button>
          <Button onClick={onCancelHandler} className="bg-gray-700">
            Cancel
          </Button>
        </div>
      </Modal>
      <Modal
        isOpen={isEdit}
        close={closeEditModal}
        onSubmit={submitHandler}
        title="Edit PRODUCT"
      >
        {renderEditProduct({ id: "title", label: "Title", name: "title" })}
        {renderEditProduct({
          id: "description",
          label: "Description",
          name: "description",
        })}
        {renderEditProduct({
          id: "imageURL",
          label: "Image URL",
          name: "imageURL",
        })}
        {renderEditProduct({ id: "price", label: "Price", name: "price" })}
        
        <div className="flex items-center space-x-2.5 mt-5">
          {/* <Button onClick={submitEditHandler} className="bg-violet-700">
            Edit
          </Button> */}
          <Button onClick={closeEditModal} className="bg-gray-700">
            Cancel
          </Button>
        </div>
      </Modal>
    </main>
  );
}

export default App;
