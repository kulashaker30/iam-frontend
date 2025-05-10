// components/FormInput.jsx
const FormInput = ({ type = "text", placeholder, value, onChange, error }) => {
    return (
      <div className="col-span-1">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="border p-2 w-full"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  };
  
  export default FormInput;
  