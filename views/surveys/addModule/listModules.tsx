import BoxEvaluations from "./boxEvaluations"

const ListModules = () => {
  return (<div className="grid grid-cols-4 gap-[20px] w-full mt-6 mb-8">
    <BoxEvaluations text={"Series de figuras"} />
    <BoxEvaluations text={"Aptitud espacial"} />
    <BoxEvaluations text={"Test de Rorschach"} />
    <BoxEvaluations text={"Pantallas universales"} />
    <BoxEvaluations text={"Otra prueba"} />
    <BoxEvaluations text={"Otra prueba"} />
    <BoxEvaluations text={"Otra prueba"} />
    <BoxEvaluations text={"Otra prueba"} />
    <BoxEvaluations text={"Otra prueba"} />
    <BoxEvaluations text={"Otra prueba"} />

  </div>)
}
export default ListModules
