export default function InputTextField({type,label,placeholder,...rest}) {
  return (

      <div className="mb-3 row">
          <label className="col-md-4 col-form-label ">{label}</label>
          <div className="col-md-8">

              <input type={type} placeholder={placeholder} className="form-control" {...rest}/>
          </div>

      </div>
  )
}
