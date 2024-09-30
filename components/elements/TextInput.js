export default function TextInput({type,label,placeholder,...rest}) {
  return (
    <>
        <div className="mb-3 row">
            <label className="col-md-2 col-form-label ">{label}</label>
            <div className="col-md-10">

                <input type={type} placeholder={placeholder} className="form-control" {...rest}/>
            </div>

        </div>
    </>
  )
}
