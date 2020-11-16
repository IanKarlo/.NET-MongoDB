import React, { useEffect, useState } from 'react';
import './index.css';

import { getAll, remove, create, update } from '../../Services/Http';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '../IconButton';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  margin: {
    margin: theme.spacing(1),
  }
}));

const ClientTable = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({});

  const handleClose = () => {
    setOpen(false);
  }

  const handleOpen = (data) => {
    if(data === undefined) {
      setForm({});
      setOpen(true);
    } else {
      setForm({
        dataNascimento: data.dataNascimento, 
        identifier: data.identifier, 
        sexo: data.sexo, 
        latitude: data.localizacao.latitude, 
        longitude: data.localizacao.longitude, 
      });
      console.log(new Date(data.dataNascimento));
      setOpen(true);
    }
  }

  const createItem = async (item) => {
    const sendItem = {...item, latitude: parseFloat(item.latitude), longitude: parseFloat(item.longitude)};
    const created = await create(sendItem);
    if(created) {
      updateData();
    } else {
      alert("Erro no servidor!");
    }
    setOpen(false);
  }

  const updateItem = async (id, item) => {
    const sendItem = {...item, latitude: parseFloat(item.latitude), longitude: parseFloat(item.longitude)};
    const updated = await update(id, sendItem);
    if(updated) {
      updateData();
    } else {
      alert("Erro no servidor!");
    }
    setOpen(false);
  }

  const updateData = async () => {
    const ret = await getAll();
    setData(ret);
  }

  const removeData = async (id) => {
    const deleted = await remove(id)
    if(deleted) {
      updateData();
    }
  }

  useEffect(() => {
    updateData();
  },[])

  return (
    <div className="table-container">
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Código</TableCell>
              <TableCell align="center">Data de nascimento</TableCell>
              <TableCell align="center">Sexo</TableCell>
              <TableCell align="center">Coordenadas</TableCell>
              <TableCell align="center">Opções</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((d) => (
              <TableRow key={d.identifier}>
                <TableCell align="center">{d.identifier}</TableCell>
                <TableCell  align="center">
                  {new Date(d.dataNascimento).toLocaleDateString("pt-br")}
                </TableCell>
                <TableCell align="center">{d.sexo}</TableCell>
                <TableCell align="center">{`${d.localizacao.latitude.toFixed(2)}, ${d.localizacao.longitude.toFixed(2)}`}</TableCell> 
                <TableCell align="center"><IconButton type="edit" onClick={() => handleOpen(d)}/> <IconButton type="del" onClick={() => removeData(d.identifier)}/></TableCell> 
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 10}}>
        <IconButton onClick={() => handleOpen()}>Adicionar novo usuário </IconButton>
      </div>
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle id="simple-dialog-title">
          Adicionar/Alterar Registro
        </DialogTitle>
        <DialogContent>
        <form className={classes.root} noValidate autoComplete="off">
        <TextField 
            id="dataNascimento" 
            label="dataNascimento" 
            type="date" 
            InputLabelProps={{
              shrink: true,
            }}
            value={form.identifier ? form.dataNascimento.split('T')[0] : form.dataNascimento} 
            onChange={(e) => setForm({...form, dataNascimento: e.target.value})}
          />
          <br/>
          <FormControl component="fieldset">
            <FormLabel component="legend">Gênero</FormLabel>
            <RadioGroup 
              aria-label="gender" 
              name="gender1" 
              value={form.sexo ? form.sexo : 'O'} 
              onChange={(e) => setForm({...form, sexo: e.target.value})}
            >
              <FormControlLabel value="F" control={<Radio />} label="Feminino" />
              <FormControlLabel value="M" control={<Radio />} label="Masculino" />
              <FormControlLabel value="O" control={<Radio />} label="Outro" />
            </RadioGroup>
          </FormControl>
          <br/>
          <TextField 
            id="Latitude" 
            label="Latitude" 
            type="number" 
            value={form.latitude} 
            onChange={(e) => setForm({...form, latitude: e.target.value})}
          />
          <TextField 
            id="Longitude" 
            label="Longitude" 
            type="number" 
            value={form.longitude} 
            onChange={(e) => setForm({...form, longitude: e.target.value})}
          />
        </form>
        <DialogActions>
          <Button 
            onClick={() => {
              if(!form.identifier) {
                createItem(form);
              } else {
                updateItem(form.identifier, form);
              }
            }} 
            color="primary" 
            autoFocus
          >
            Enviar
          </Button>
        </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ClientTable;