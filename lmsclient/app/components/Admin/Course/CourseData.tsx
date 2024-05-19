import { styles } from "@/app/styles/style";
import React, { FC } from "react";
import { RiAddCircleFill } from "react-icons/ri";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import toast from "react-hot-toast";

type Props = {
       benefits: { title: string }[];
setBenefits: (benefits: { title: string }[]) => void;
       prerequisites: { title: string }[];
setPrerequisites: (prerequisites: { title: string }[]) => void;
         active: number;
setActive: (active: number) => void;
};


const CourseData: FC<Props> = ({
               benefits,       setBenefits,  //преимущество
            prerequisites,  setPrerequisites, //условия
        active,         setActive,  //какой активный
}          ) => {
//------------------------------------
//добавляем преимущества в строку
  const handleBenefitChange = (index: number, value: any) => {
     const updatedBenefits = [...benefits];
     updatedBenefits[index].title = value;
    setBenefits(updatedBenefits);
     };
let tt=false
  //добавляем еще одну строку для преимущества   
  const handleAddBenefit = () => {
    if ( //есть ли пустая сам изменил
    benefits[benefits.length - 1]?.title !== "")
     { tt=true} else {tt=false
       toast.error(" Пустая Please fill the fields for go to next!")}

  if (tt) {
       setBenefits([...benefits, { title: "" }]);
     }
      };
//---------------------------
//добавляем условия к курсу в строку
  const handlePrerequisitesChange = (index: number, value: any) => {
    const updatedPrerequisites = [...prerequisites];
    updatedPrerequisites[index].title = value;
    setPrerequisites(updatedPrerequisites);
  };
//добавляем еще одну строку для добавления условия
  const handleAddPrerequisites = () => {
    setPrerequisites([...prerequisites, { title: "" }]);
  };
//---------------------------------------
  const prevButton = () => {
    setActive(active - 1);
  };

  const handleOptions = () => {
    if ( //есть ли пустая
      benefits[benefits.length - 1]?.title !== "" &&
      prerequisites[prerequisites.length - 1]?.title !== ""
    ) {
      setActive(active + 1); //следующая
    } else {
      toast.error("Please fill the fields for go to next!");
    }
  };

 // console.log(benefits)
 // console.log(prerequisites)

  return (
    <div className="w-[80%] m-auto mt-24 block">
     <div>
        <label className={`${styles.label} text-[20px]`} htmlFor="email">
          What are the benefits for students in this course?
          Каковы преимущества для студентов этого курса?
        </label>
        <br />
        {benefits.map((benefit: any, index: number) => (
          <input
            type="text"
            key={index}
            name="Benefit"
            placeholder="You wilRrbe able to build a full stack LMS Platform..."
            required
            className={`${styles.input} my-2`}
            value={benefit.title}
            onChange={(e) => handleBenefitChange(index, e.target.value)}
          />
        ))}
        <AddCircleIcon //значок +  добавляет еще строку
         className= " dark:text-white  text-black "   
          style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }}
          onClick={handleAddBenefit}
        />
        </div>  

     <div>  
        <label className={`${styles.label} text-[20px]`} htmlFor="email">
          What are the prerequisite for starting this course?
          Каковы необходимые условия для начала этого курса??
        </label>
        <br />
        {prerequisites.map((prerequisites: any, index: number) => (
          <input
            type="text"
            key={index}
            name="prerequisites"
            placeholder="You wilRrbe able to build a full stack LMS Platform..."
            required
            className={`${styles.input} my-2`}
            value={prerequisites.title}
            onChange={(e) => handlePrerequisitesChange(index, e.target.value)}
          />
        ))}
        <AddCircleIcon //значок +  добавляет еще строку
         className= " dark:text-white  text-black "
          style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }}
          onClick={handleAddPrerequisites}
        />
      </div>  

      <div className="w-full flex items-center justify-between">
        <div
          className="w-full 800px:w-[180px] h-[40px] flex items-center justify-center bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={() => prevButton()}
        >
          Prev
        </div>
        <div
          className="w-full 800px:w-[180px] h-[40px] flex items-center justify-center bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={() => handleOptions()}
        >
          Next
        </div>
      </div>  
    </div>
  );
};
export default CourseData;
