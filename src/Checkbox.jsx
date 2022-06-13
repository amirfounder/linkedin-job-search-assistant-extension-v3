import React from "react"


export const Checkbox = ({
  value,
  onChange,
  id,
  label
}) => {
  return (
    <label
      style={{ display: 'block' }}
    >
      <input
        type='checkbox'
        id={id}
        checked={value}
        onChange={onChange}
      />
      {label}
    </label>
  )
}
