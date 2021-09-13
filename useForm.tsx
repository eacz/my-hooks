import { useState } from "react"

const useForm = <T extends Object> (initState: T) => {
  const [state, setState] = useState(initState)

  const onChange = <K extends Object>(value: K, field: keyof T) => {
    setState({
      ...state,
      [field]:value
    })
  }
  
  return {
    ...state,
    form: state,
    onChange
  }
}

export default useForm
