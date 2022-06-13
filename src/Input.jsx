import React from 'react'

export const TextInput = ({
  value,
  id,
  onChange,
  label
}) => {
  return (
    <label>
      {label}
      <input
        type='text'
        id={id}
        value={value}
        onChange={onChange}
        style={{
          width: 'calc(100% - 10px)',
          fontSize: '11px',
          padding: '3px'
        }}
      />
    </label>
  )
}