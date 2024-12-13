const InputField = ({ label, value, onChange, disabled, name }) => (
  <div className="col-md-6 d-flex align-items-center mb-3">
    <label className="form-label me-2 text-start" style={{ minWidth: '150px' }}>{label}:</label>
    <input 
      type="text" 
      className="form-control" 
      name={name} 
      value={value || ''} 
      onChange={onChange}  
      disabled={disabled} 
    />
  </div>
);

export default InputField;
