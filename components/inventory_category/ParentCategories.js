import SubCategories from './SubCategories';
import { Modal, Button, Form } from "react-bootstrap";
import Select from '../elements/Select';

export default function ParentCategories({categories,ParentId,loading,label}) {

    return (
      <>
        <Form.Label>{label}</Form.Label>
          {loading ? (
            <Select onChange={(e) => ParentId(e.target.value)}>
              <option value="">loading...</option>
            </Select>
          ) : (
            <Select onChange={(e) => ParentId(e.target.value)}>
            <option value="0">none</option>
            {categories &&
            categories?.map((cat,ind)=>(
             <>
              <option value={cat.id}>{cat.name}</option>
              {cat?.children_recursive?.length != 0 && (
                <SubCategories cat={cat} dot='----' />
              )} 
            </>
            ))
            }
          </Select>
          )}
      </>
    );
  }
          
