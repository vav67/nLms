"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLast12MonthsDate = void 0;
/* В этом коде мы используем цикл, чтобы пройти по последним 12 месяцам.
Для каждого месяца мы вычисляем начало и конец месяца, а затем подсчитываем
количество документов в вашей модели, созданных в этом интервале.
Мы используем unshift, чтобы вставить результаты в начало массива last12Months,
чтобы они были упорядочены сначала с самого нового месяца.
*/
// сюда добпавляется пользовательская модель
async function generateLast12MonthsDate(model) {
    const last12Months = []; //данные за 12мес
    const currentDate = new Date(); //текущ дата
    for (let i = 0; i < 12; i++) {
        // Получаем начало и конец текущего месяца
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);
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
exports.generateLast12MonthsDate = generateLast12MonthsDate;
