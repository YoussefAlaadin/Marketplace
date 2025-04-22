import { txtSlicer } from "../utils/functionality";
import Image from "./Image";
import Button from "./ui/Button";

const ProductCard = ({ product, setProductToEdit, setIsEdit, openEditModal,setProductToEditIdx, idx }) => {
  const { title, description, imageURL, price, name, category, units, views  } = product;

    //      ** Handler**     //
    const onEdit=()=>{
      //console.log("Edit product", product);
      setProductToEdit(product);
      setIsEdit(true);
      openEditModal();
      setProductToEditIdx(idx);
    }


  //      ** Render**     //

  
  return (
    <div className="mx-auto p-3 border border-gray-300 rounded-md flex flex-col max-w-sm md:max-w-lg">
      <Image
        className={"rounded-md mb-4 w-full h-48 object-cover"}
        src={imageURL}
        alt={name}    
      />
      <h3 className="text-lg font-semibold">{txtSlicer(title, 21)}</h3>
      <p className="text-gray-500 break-words">{txtSlicer(description, 100)}</p>

      <div className="flex flex-col mt-4 space-y-2">
        <span className="text-2xl font-semibold text-indigo-600">${price}</span>
        <span className={" rounded-full text-lg font-semibold mr-1  text-indigo-600"}>Category: {category}</span>
        <span className={" rounded-full text-lg font-semibold mr-1  text-indigo-600"}>Units: {units}</span>
        <span className={" rounded-full text-lg font-semibold mr-1  text-indigo-600"}>Views: {views}</span>
      </div>
      <div className="flex items-center justify-between space-x-2 mt-8 ">
        <Button className="bg-violet-700 " onClick={onEdit} >Edit</Button>
        <Button className="bg-red-600 ">Destroy</Button>
      </div>
    </div>
  );
};
export default ProductCard;
