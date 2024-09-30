
import { Form } from "react-bootstrap";


export default function FileSelectButton(props) {
  return (
    <Form.Group className="mb-3">
        <Form.Label>Image Select</Form.Label>
        <Form.Control
        type="button"
        value="Choose File"
        onClick={props?.handleShow}
        className="btn btn-primary mb-3"
        />
        <div className={`container-fluid ${props?.files?.upload_files?.length > 0 ? 'd-block' : 'd-none'}`}>
            <div className="row">
                <div className="col-md-12">
                    <div className="flex-gap align-content-start">
                    {
                        props?.files?.upload_files && props?.files?.upload_files.map((file,index)=>(
                
                            <div className="mb-3" key={index}>
                                <label htmlFor='img'>
                                    <div className="text-end">
                                        <i className="fas fa-times-circle text-danger" onClick={()=> {props.removePhoto(file?.id)}}></i>
                                    </div>
                                    <img 
                                        src={`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}${file?.file_path}`}
                                        className="rounded mx-auto d-block"  alt="responsive"
                                    />
                                </label>
                            </div>
                    
                        ))

                    }
                    </div>
                </div>

            </div>
        </div>

    </Form.Group>
  )
}




