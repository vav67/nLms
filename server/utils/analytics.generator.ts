import { Document, Model } from "mongoose";

//сгенерируем нашу аналитику за последние 12 мес

interface MonthData {
  month: string;
  count: number;
}
/* В этом коде мы используем цикл, чтобы пройти по последним 12 месяцам. 
Для каждого месяца мы вычисляем начало и конец месяца, а затем подсчитываем 
количество документов в вашей модели, созданных в этом интервале. 
Мы используем unshift, чтобы вставить результаты в начало массива last12Months, 
чтобы они были упорядочены сначала с самого нового месяца.
*/
// сюда добпавляется пользовательская модель
export async function generateLast12MonthsDate<T extends Document>(
  model: Model<T> ): Promise<{ last12Months: MonthData[] }>
 {
  const last12Months: MonthData[] = []; //данные за 12мес
    const currentDate = new Date(); //текущ дата
   
    for (let i = 0; i < 12; i++) {
        // Получаем начало и конец текущего месяца
        const startDate = new Date(currentDate.getFullYear(),
           currentDate.getMonth() - i, 1);
        const endDate = new Date(currentDate.getFullYear(), 
           currentDate.getMonth() - i + 1, 0);
    
        const monthYear = startDate.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
    
        const count = await model.countDocuments({
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        });
     //------ это точка за последние 12 месяцев - массив
        last12Months.unshift({ month: monthYear, count }); // Используем unshift для вставки в начало массива
      }
    
 
  return { last12Months }; //последний 12мес
}