function InputField(payload) {
  const {
    type = "text",
    placeholder = "",
    value,
    onChange,
    className = "",
    labelClass = "",
    name = "",
    label = "",
  } = payload;
  return (
    <div>
      <label
        htmlFor={name}
        className={
          labelClass
            ? labelClass
            : "block text-sm font-medium text-gray-700 mb-2"
        }
      >
        {label}
        {label && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={type === "password" ? "current-password" : "off"}
        className={
          className
            ? className
            : "w-full px-4 py-3 border border-gray-300 rounded-md text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        }
      />
    </div>
  );
}

export default InputField;
