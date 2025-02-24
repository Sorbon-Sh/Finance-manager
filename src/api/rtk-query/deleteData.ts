import supabase from "../supabaseClient";

const deleteTransaction = async (id: string) => {
  const { error } = await supabase
    .from("transactions") // Укажи свою таблицу
    .delete()
    .eq("id", id); // Фильтр по `id`

  if (error) {
    console.error("Ошибка удаления:", error.message);
  } else {
    console.log("Запись удалена");
  }
};

export default deleteTransaction;
