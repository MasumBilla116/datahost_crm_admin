import { useRouter } from 'next/router';
import React, { useEffect, useState } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import Button from '../../../../../components/elements/Button';
import Form from '../../../../../components/elements/Form';
import Label from '../../../../../components/elements/Label';
import Select2 from '../../../../../components/elements/Select2';
import TextInput from '../../../../../components/elements/TextInput';
import toast from "../../../../../components/Toast/index";
import Axios from '../../../../../utils/axios';
import Link  from 'next/link';
import DeleteIcon from '../../../../../components/elements/DeleteIcon';
import EditIcon from '../../../../../components/elements/EditIcon';

const CreateVoucher = () => {
  
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  // const [item, setItem]= useState({
  //   itemData:[
  //     {id: 0, code: 'select value', name: '', inventory_category_id: '', description: ''},

  //   ],
  // })

    const {http} = Axios();
    const router = useRouter();
    const { id } = router.query;

    const [vouchers, setVouchers] = useState([]);
    console.log(vouchers)
    const [deletedVouchers, setDeletedVouchers] = useState([])
    console.log(deletedVouchers)
    const [date, setDate] = useState([]);
    const [itemId, setItemId] = useState("");
    const [test, setTest] = useState("");
    const [itemName, setItemName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [categoryData, setCategoryData] = useState();
    const [itemCode, setItemCode] = useState("");
    const [itemCodeName, setItemCodeName] = useState("");
    const [item_obj, setItemObj] = useState();
    //const [code_obj, setCodeObj] = useState();
    const [remarks, setRemarks] = useState("");
    const [totalRemarks, setTotalRemarks] = useState("");
    const [quantity, setQuantity] = useState();
    const [getItems, setItems] = useState();
    const items_options = getItems?.data;
    const [getItemCategories, setItemCategories] = useState("");
    const categories_options = getItemCategories.data;
    const [switcher, setSwitcher] = useState(true);
    const [itemLoading, setItemLoading] = useState(true)

    let item_name_options = {value:itemId || '', label:itemName || 'Select...'};
  
    const [loading, setLoading] = useState(false)
    const [pending, setPending] = useState(false)
    const [pendingCat, setPendingCat] = useState(false)

    useEffect(()=>{
      const controller = new AbortController();
        async function getVoucherInfo(){
          if(switcher){  
          await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/consumption-voucher`,{action: "getVoucherInfo", voucher_id: id})
            .then((res)=>{
                setTotalRemarks(res?.data?.data?.remarks);
                setDate(res?.data?.data?.voucher_date)
                setVouchers(res?.data?.data?.voucher_list)
            });
          }
        }
        
        async function getAllItems(){
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/items`,{action: "getAllItems"})
            .then((res)=>{
              setItems(res?.data);
            });
          }
        const categoryList = async () => {
          await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/category`,{action: "getAllCategories"})
          .then((res)=>{
            setItemCategories(res.data);
          });
        };

          router.isReady && !itemCode && !categoryId && getVoucherInfo()
          getItemByCategory()
          getAllItems();
          categoryList();
          getItemByCode();
          return ()=> controller.abort();

    },[id, categoryId, itemCode])
    
    const [ind, setInd] = useState(1)

    const StoringData =(e) =>{
      e.preventDefault();
      e.target.reset();
      setInd(()=> ind+1)
      
      var voucherItemId = [];

      {
        vouchers.map(item=>{
          voucherItemId.push(item.itemId);
        })
      }

      if(voucherItemId.includes(itemId)){
        notify("error", "can not add same item!");
      }
      else{
        if(item_name_options.value == ''){
          setVouchers([...vouchers,
            {
              id: ind,
              // catId: categoryId,
              // catName: categoryName,
              itemCode: itemCode,
              itemCodeName: itemCodeName,
              itemId: itemId,
              itemName: itemName,
              remarks: remarks,
              item_qty: quantity
            }
          ]) 
        }
        else{
          setVouchers([...vouchers, 
            {
              id: ind,
              // catId: categoryId,
              // catName: categoryName,
              itemCode: itemCode,
              itemCodeName: itemCodeName,
              itemId: item_name_options.value,
              itemName: item_name_options.label,
              remarks: remarks,
              item_qty: quantity
            }
          ]) 
          setItemObj(null)
        }
      }
      
      
      
            
          
      
    }

    const [objedit, setObjEdit] = useState(false);
    const [arrayIndex, setArrayIndex] = useState();
    const [editId, setEditId] = useState('');
    const [editedItemId, setEditedItemId] = useState('');
    const [editedItemName, setEditedItemName] = useState('');

    const selected_category_options = {value:categoryId, label:categoryName};
    const selected_code_options = {value:itemCode, label:itemCodeName};
    const selected_item_options = {value:itemId, label:itemName};

    function editobj(index, editId){
      setObjEdit(true)
      setArrayIndex(index)
      setEditId(editId)
      setQuantity(vouchers[index]?.item_qty)
      setRemarks(vouchers[index]?.remarks)
      setItemId(vouchers[index]?.itemId)
      setItemName(vouchers[index]?.itemName)
      // setCategoryId(vouchers[index]?.catId)
      // setCategoryName(vouchers[index]?.catName)
      setItemCode(vouchers[index]?.itemCode)
      setItemCodeName(vouchers[index]?.itemCodeName)
    }

    const UpdateData =(e) =>{
      e.preventDefault();
      
      const newState = vouchers.map(obj => {
        if (obj.id === editId) {
          if(item_name_options.value == ''){
             return {...obj, itemCode:itemId, itemCodeName: itemCodeName, itemId: itemId, itemName: itemName, remarks: remarks, item_qty: quantity};
          }
          else{
            return {...obj, itemCode:itemId, itemCodeName: itemCodeName, itemId: item_name_options.value, itemName: item_name_options.label, remarks: remarks, item_qty: quantity};
          }
        }
        return obj;
      });
  
      setVouchers(newState);
      e.target.reset();
      setObjEdit(false)
    }

    async function removeObjectFromArray(id, index){

      setDeletedVouchers([...deletedVouchers, 
        {
          itemId: vouchers[index]?.itemId,
          itemName: vouchers[index]?.itemName,
          remarks: vouchers[index]?.remarks,
          item_qty: vouchers[index]?.item_qty
        }
      ]) 

      setVouchers(current =>
        current.filter(obj => {
          return obj.id !== id;
        }),
      );

    };

    const changeCategory = (e)=>{
      if(e.value){
        setCategoryId(e.value);
        setCategoryName(e.label);
      }
    }

    const getItemByCategory = async()=>{
      let isSubscribed = true;
      if(categoryId !== ""){
        setPending(true)
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/consumption-voucher`,{action: "getItemByCategory",id: categoryId})
        .then((res)=>{
          if(isSubscribed){
            setCategoryData(res.data.data);
            setPending(false)
          }
        });
      }
      return ()=> isSubscribed=false;
    }
   
    const changeItem = (e)=>{
      if(e.value){
        setItemCode(e.value)
        setItemCodeName(e.label)
      }
    }

    const getItemByCode = async()=>{
      let isSubscribed = true;
      if(itemCode !== ""){
        setPending(true)
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/consumption-voucher`,{action: "getItemByCode",id: itemCode})
        .then((res)=>{
          if(isSubscribed){
            //setItemObj(res.data.data);
            setItemId(res.data.data.id);
            setItemName(res.data.data.name);
            setPending(false)
            setSwitcher(false);
          }
        });
      }
      return ()=> isSubscribed=false;
    }
    
    const changeItemCode = (e)=>{
      if(e.value){
        setItemId(e.value);
        setItemName(e.label);
        setItemCodeName(e.code)
      }
    }

    // const getCodeByItem = async()=>{
    //   let isSubscribed = true;
    //   if(itemId !== ""){
    //     setPendingCode(true)
    //     await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/consumption-voucher`,{action: "getCodeByItem",id: test})
    //     .then((res)=>{
    //       if(isSubscribed){
            
    //         setCodeObj(res.data.data);
            
    //         setPendingCode(false)
    //       }
    //     });
    //   }
    //   return ()=> isSubscribed=false;
    // }
    
    async function submitForm(e) {
      e.preventDefault();
      setLoading(true)
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/consumption-voucher`,{action: "updateVoucher", voucher_id: id, vouchers, deletedVouchers, totalRemarks, date})
      .then((res)=>{
        console.log(res)
        setLoading(false)
        console.log(res)
         notify("success", "successfully Updated!");
         router.push('/modules/inventory/vouchers');
         setVourchers([])
         e.target.reset();
      })
      .catch((e)=>{
        setLoading(false)
        const msg = e.response?.data?.response;
         if(typeof(e.response?.data?.response) == 'string'){
          notify("error", `${e.response?.data?.response}`);
         }
         else{
          if(msg?.date){
            notify("error", `${msg?.date?.Date}`);
          }
         }
      });
     }

    return ( 

      <>
      <div className="container-fluid ">
        <div className="row">
            <div className="col-md-6">
              {objedit ? (
                <div className="card">
                <div className="card-body border-bottom">
                  <h4 className="card-title">Update Voucher</h4>
                </div>
                <form onSubmit={UpdateData}>
                  <div className="card-body"> 

                  {/* <div className="mb-3 row">          
                    <Label text="Select Category"/>
                    <div className="col-sm-10">
                    <Select2
                        options={categories_options?.map(({ id, name }) => ({ value: id, label: name}))}  
                        value={selected_category_options}
                        onChange={changeCategory}
                    />
                    </div>
                  </div>

                  <div className="mb-3 row">          
                    <Label text="Select Item Code"/>
                    <div className="col-sm-10">
                    <Select2
                        options={items_options?.map(({ id, code }) => ({ value: id, label: code}))}
                        value={selected_code_options}
                        onChange={changeItem}
                    />
                    </div>
                  </div>

                  {pending && 
                    <div className="mb-3 row">
                    <Label text="Select Item"/>
                    <div className="col-sm-10">
                    <Select2
                        options={categoryData?.map(({ id, name }) => ({ value: id, label: name}))}
                        onChange={changeItemCode}
                        value={{value:"", label:"loading..."}}
                    />
                    </div>
                    </div>
                  }
                  
                    {!pending && 
                    <div className="mb-3 row">
                        <Label text="Select Item"/>
                        <div className="col-sm-10">
                        <Select2
                            options={categoryData?.map(({ id, name, code }) => ({ value: id, label: name, code: code}))}
                            value={item_name_options}
                            onChange={changeItemCode}
                        />
                        </div>
                    </div>} */}

                    <TextInput type="number" label="Qty" value={quantity} onChange={(e)=>setQuantity(e.target.value)} />

                    <TextInput label="Remarks" placeholder="Remarks" value={remarks} onChange={(e)=>setRemarks(e.target.value)} />

                  </div>
                  <div className="p-3 border-top">
                    <div className="text-end">
                      <button  className="btn-info">
                        Update
                      </button>
                      <button onClick={() => setObjEdit(false)} className="btn-dark">
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              ) : (
              <div className="card">
                <div className="card-body border-bottom">
                  <h4 className="card-title">Create Voucher</h4>
                </div>
                <form onSubmit={StoringData}>
                  <div className="card-body">

                  <div className="mb-3 row">          
                    <Label text="Select Category"/>
                    <div className="col-sm-10">
                    <Select2
                        options={categories_options?.map(({ id, name }) => ({ value: id, label: name}))}  
                        onChange={changeCategory}
                    />
                    </div>
                  </div>

                  {/* {pendingCode &&
                    <div className="mb-3 row">          
                    <Label text="Select Item Code"/>
                    <div className="col-sm-10">
                    <Select2
                        options={items_options?.map(({ id, code }) => ({ value: id, label: code}))}
                        onChange={changeItem}
                    />
                    </div>
                    </div>
                    } */}

                    {/* {itemLoading &&
                    <div className="mb-3 row">          
                    <Label text="Select Item Code"/>
                    <div className="col-sm-10">
                    <Select2
                        options={item?.itemData?.map(({ id, code }) => ({ value: id, label: code}))}
                        onChange={changeItem}
                        //defaultValue={item_code_options} 
                    />
                    </div>
                    </div>
                    } */}

                    <div className="mb-3 row">          
                    <Label text="Select Item Code"/>
                    <div className="col-sm-10">
                    <Select2
                        options={items_options?.map(({ id, code }) => ({ value: id, label: code}))}
                        onChange={changeItem}
                        value={selected_code_options}
                    />
                    </div>
                    </div>
                    

                    {pending && 
                    <div className="mb-3 row">
                    <Label text="Select Item"/>
                    <div className="col-sm-10">
                    <Select2
                        options={categoryData?.map(({ id, name, code }) => ({ value: id, label: name, code: code}))}
                        onChange={changeItemCode}
                        defaultValue={{value:"", label:"loading..."}}
                    />
                    </div>
                    </div>
                    }

                    {!pending && 
                      <div className="mb-3 row">
                      <Label text="Select Item"/>
                      <div className="col-sm-10">
                      <Select2
                          options={categoryData?.map(({ id, name }) => ({ value: id, label: name}))}
                          defaultValue={item_name_options}
                          onChange={changeItemCode}
                      />
                      </div>
                      </div>
                    }
                    

                    <TextInput type="number" label="Qty" placeholder="item qty" required onChange={(e)=>setQuantity(e.target.value)} />

                    <TextInput label="Remarks" placeholder="Remarks"  onChange={(e)=>setRemarks(e.target.value)} />

                  </div>
                  <div className="p-3 border-top">
                    <div className="text-end">
                      <Button  className="btn-info">
                        Add to Voucher
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
              )}
              

            </div>

            <div className="col-md-6">
            <div className="card">
              <div className="border-bottom title-part-padding">
                <h4 className="card-title mb-0">All Items</h4>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table
                    id="multi_col_order"
                    className="table table-striped table-bordered display"
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        {/* <th>id</th> */}
                        <th>Item Name</th>
                        <th>Remarks</th>
                        <th>Qty</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vouchers?.map((item, index)=>(
                        <>
                        {item.itemId !== null && (                                                   
                          <tr key={index}>
                            {/* <td>{item.id}</td> */}
                            <td>{item.itemName}</td>
                            <td>{item.remarks}</td>
                            <td>{item.item_qty}</td>
                            <td>
                            <ul className="action">
                                <li>
                                  <Link href="#">
                                    <a onClick={() => editobj(index, item.id)}>
                                      <EditIcon />
                                    </a>
                                  </Link>
                                </li>
                                <li>
                                <Link href='#'>
                                   <a onClick={() => removeObjectFromArray(item.id, index)}>
                                     <DeleteIcon />
                                   </a>
                                </Link>
                                </li>
                              </ul>
                            </td>
                          </tr>
                        )}
                        </>
                      ))}
                      
                    </tbody>
                    
                  </table>
                  <form onSubmit={submitForm}>

                      <div className="mb-3 row col-md-12">
                         <label className="col-md-3 col-form-label ">Voucher Remarks:</label>
                        <div className="col-md-5">
                          <input type="text" placeholder="Voucher Remarks" defaultValue={totalRemarks} className="form-control" onChange={(e)=>setTotalRemarks(e.target.value)}/>
                        </div>
                      </div>
                      
                      <div className="mb-3 row col-md-12">
                      <label className="col-md-3 col-form-label ">Voucher Date:</label>
                        <div className="col-sm-5">
                          <input type="date" defaultValue={date} onChange={(e) => setDate(e.target.value)} className="form-control" id="date" />
                        </div>
                      </div>

                      {loading ? 
                      <button disabled={loading} className="btn-danger rounded" style={{float: 'right'}}>
                         Processing...
                      </button>
                      : 
                      <button disabled={loading} className="btn-info rounded" style={{float: 'right'}}>
                          Update Voucher
                      </button>
                      }

                  </form>     
                </div>
              </div>
            </div>
          </div>
            
        </div>
    </div>
      </>
     );
}
 
export default CreateVoucher; 