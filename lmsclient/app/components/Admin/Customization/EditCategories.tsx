import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import { toast } from "react-hot-toast";

type Props = {};

const EditCategories = (props: Props) => {
  //запрос на получение данных - макет данных часто задаваемых вопросов
  // передаем type= Categories
  const { data, isLoading, refetch } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });
//редактируем запрос Категории
  const [editLayout, { isSuccess: layoutSuccess, error }] =
    useEditLayoutMutation();
   //состояние
    const [categories, setCategories] = useState<any>([]);

  useEffect(() => {
    if (data) { //получаем данные
      setCategories(data.layout?.categories);
    }

  if (layoutSuccess) {    //результат редактирования  Категории
      refetch(); //повторно загрузить
      toast.success("Categories updated successfully");
    }
  if (error) {    //результат редактирования  Категории
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData?.data?.message);
      }
    }
  }, [data, layoutSuccess, error, refetch]);

   //добавляем категорию 
  const handleCategoriesAdd = (id: any, value: string) => {
    setCategories((prevCategory: any) =>
      prevCategory.map((i: any) => (i._id === id ? { ...i, title: value } : i))
    );
  };

  //проверка категории что не пустая
  const newCategoriesHandler = () => {
    if (categories[categories.length - 1].title === "") {
      toast.error("Category title cannot be empty");
    } else {
      setCategories((prevCategory: any) => [...prevCategory, { title: "" }]);
    }
  };

  const areCategoriesUnchanged = ( //поверка изменилась ли категория
    originalCategories: any[],
    newCategories: any[]
  ) => {
    return JSON.stringify(originalCategories) === JSON.stringify(newCategories);
  };

  // проверяем о наличии пустой категории
  const isAnyCategoryTitleEmpty = (categories: any[]) => {
    return categories.some((q) => q.title === "");
  };

  //редактирование категории
  const editCategoriesHandler = async () => {
    if (
      !areCategoriesUnchanged(data.layout?.categories, categories) &&
      !isAnyCategoryTitleEmpty(categories)
    ) { //выполняем запрос редактирования
      await editLayout({ type: "Categories", categories, });
    }
  };

  return (
    <>
      {isLoading ? ( // подождем пока загрузяться данные
        <Loader />
      ) : (
        <div className="mt-[120px] text-center">
          <h1 className={`${styles.title}`}>All Categories</h1>
          {categories && //пройдемся по категориям
            categories.map((item: any, index: number) => {
              return (
                <div className="p-3" key={index}>
                  <div className="flex items-center w-full justify-center">
                    <input
                      className={`${styles.input} !w-[unset] !border-none !text-[20px]`}
                      value={item.title}
                      onChange={(e) =>
                        handleCategoriesAdd(item._id, e.target.value)
                      }
                      placeholder="Enter category title..."
                    />
                    <AiOutlineDelete
                      className="dark:text-white text-black text-[18px] cursor-pointer"
                      onClick={() => {
                        setCategories((prevCategory: any) =>
                          prevCategory.filter((i: any) => i._id !== item._id)
                        );
                      }}
                    />
                  </div>
                </div>
              );
            })}
          <br />
          <br />
          <div className="w-full flex justify-center">
            <IoMdAddCircleOutline
              className="dark:text-white text-black text-[25px] cursor-pointer"
              onClick={newCategoriesHandler}
            />
          </div>
          <div
            className={`${  styles.button}
 !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34] 
 ${ areCategoriesUnchanged(data.layout?.categories, categories) ||
              isAnyCategoryTitleEmpty(categories)
                ? "!cursor-not-allowed"
                : "!cursor-pointer !bg-[#42d383]"
     }
            !rounded absolute bottom-12 right-12`}
            onClick={ //если категория не пустая или редактировалась 
              areCategoriesUnchanged(data.layout?.categories, categories) ||
              isAnyCategoryTitleEmpty(categories)
                ? () => null
                : editCategoriesHandler
            }
          >
            Save
          </div>
        </div>
      )}
    </>
  );
};

export default EditCategories;
