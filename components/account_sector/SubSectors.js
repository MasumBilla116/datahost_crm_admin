export default function SubSectors({sect,dot}) {

return (
  <>
    {sect?.children_recursive?.map((subsect, i)=>(
        <>
        <option value={subsect.id} data_name={subsect.title} >{dot}{subsect.title}</option>
        {subsect?.children_recursive?.length != 0 && (
            <SubSectors sect={subsect} dot={'----'+dot} />
        )}
        </>
    ))}
  </>
);
}