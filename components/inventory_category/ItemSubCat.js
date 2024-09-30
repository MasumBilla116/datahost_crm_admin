export default function ItemSubCat({cat,dot}) {

    return (
      <>
        {cat?.children_recursive?.map((subcat, i)=>(
            <>
            {subcat?.children_recursive?.length != 0 ?
               <option disabled value={subcat.id}>{dot}{subcat.name}</option>
            :
               <option value={subcat.id}>{dot}{subcat.name}</option>
            }
            {subcat?.children_recursive?.length != 0 && (
                <ItemSubCat cat={subcat} dot={'----'+dot} />
            )}
            </>
        ))}
      </>
    );
  }
  