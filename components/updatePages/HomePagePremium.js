import React from 'react';
import TextInput from "../elements/TextInput";

export default function Page({ onSubmit }) {
  return (
    <>
        <div>
          <hr />
          <TextInput
            type="text"
            label="Premium Facility"
            name="facility" 
            required
          />
        
        </div>
    </>
  )
}
