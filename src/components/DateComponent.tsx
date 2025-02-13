import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";

const DateComponent = () => {
  const { control } = useForm();
  return (
    <Controller
      control={control}
      name="date"
      rules={{ required: true }}
      render={({ field: { onChange, name, value }, formState: { errors } }) => (
        <div className="bg-gray-100 rounded-lg ">
          <p className="text-xs text-gray-500">Дата поступления денег</p>
          <DatePicker
            value={value || new Date()}
            onChange={(date) => {
              onChange(date?.isValid ? date : "");
            }}
            format="MM.DD.YYYY, HH:mm:ss"
            plugins={[<TimePicker position="bottom" />]}
            style={{ border: "0", width: "100%" }}
            inputClass="p-4 flex items-center justify-between"
            containerClassName="w-full "
          />

          {errors && errors[name] && errors[name].type === "required" && (
            //if you want to show an error message
            <span>Введите дата и время</span>
          )}
        </div>
      )}
    />
  );
};

export default DateComponent;
