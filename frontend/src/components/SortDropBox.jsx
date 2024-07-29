import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SortDropBox({sortOrder, setSortOrder}) {

  const handleChange = (event) => {
    setSortOrder(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{minWidth: 150,marginBottom:'10px' }}>
        <InputLabel 
          id="demo-simple-select-label"
        >
          Sort by Date
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={sortOrder}
          label="Sort Order"
          onChange={handleChange}
        >
          <MenuItem value={'desc'} >Newest First</MenuItem>
          <MenuItem value={'asc'} >Oldest First</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
