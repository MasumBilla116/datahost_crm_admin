export default function SubCategories({cat,dot}) {

    return (
      <>
        {cat?.children_recursive?.map((subcat, i)=>(
            <>
            
               <option value={subcat.id}>{dot}{subcat.name}</option>
           
            {subcat?.children_recursive?.length != 0 && (
                <SubCategories cat={subcat} dot={'----'+dot} />
            )}
            </>
        ))}
      </>
    );
  }