
import { useState,useEffect } from 'react'
import {Outlet} from 'react-router-dom'
import {PageTitle} from '../../../_metronic/layout/core' 
import { useForm } from "react-hook-form"; 
import Swal from 'sweetalert2';

import {getSerie} from './services/EmisionService';  

import {DatosEmisor} from './components/DatosEmisor'
import {DatosReceptor} from './components/DatosReceptor'
import {DatosReferencia} from './components/DatosReferencia'
import { DatosEmision } from './components/DatosEmision'
import { DatosDetalle } from './components/DatosDetalle'
import { DatosTotales } from './components/DatosTotales';  
import {useEmision} from './core/EmisionContext'; 
import {CreateCpe} from './services/EmisionService';  
import {useAuth} from '../auth'
  
const profileBreadCrumbs = [
  {
    title: 'Busqueda',
    path: '/emision/factura',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]
 
const NotaCreditoPage = () => {
  
  let { register, handleSubmit } = useForm();   
  const {currentEmisor} = useAuth(); 
  const { datosCpe,datosReceptor,datosItem, datosTotales, datosReferencia} = useEmision();
  const [ dataSerie, setDataSerie ] = useState();


  const getSerieEmisor = async () => { 
    const serie = await getSerie({rucEmisor:currentEmisor.rucEmisor});
    setDataSerie(serie);
  };

  useEffect(() => {   
    getSerieEmisor()
 
  }, [])  

  const manejarSubmit = async (data) => {   

    if (!datosCpe || !datosCpe.fechaCpe) { 

      Swal.fire({
        icon: "error",
        title: "Debe seleccionar la Fecha de Emisión",
        showConfirmButton: false,
        timer: 5000
      })            
      return false;
    }
 
    if (!datosCpe || !datosCpe.fechaVencimiento) { 
      Swal.fire({
        icon: "error",
        title: "Debe seleccionar la Fecha de Vencimiento",
        showConfirmButton: false,
        timer: 5000
      })      
      return false;
    }
 
    if (!datosCpe || !datosCpe.moneda) { 
      Swal.fire({
        icon: "error",
        title: "Debe seleccionar la Moneda",
        showConfirmButton: false,
        timer: 5000
      })     
      return false;
    }

    if (!datosReceptor || !datosReceptor.tipoDocumento) { 
      Swal.fire({
        icon: "error",
        title: "Debe seleccionar el Tipo de Documento del Receptor",
        showConfirmButton: false,
        timer: 5000
      })    
      return false;
    }

    if (!datosReceptor || !datosReceptor.numeroDocumento) { 
      Swal.fire({
        icon: "error",
        title: "Debe ingresar el Número de Documento del Receptor",
        showConfirmButton: false,
        timer: 5000
      })   
      return false;
    }

    if (!datosReceptor || !datosReceptor.razonSocial) { 
      Swal.fire({
        icon: "error",
        title: "Debe ingresar la Razón Social del Receptor",
        showConfirmButton: false,
        timer: 5000
      })  
      return false;
    }

    if (!datosReferencia || !datosReferencia.tipoCpe) { 
      Swal.fire({
        icon: "error",
        title: "Debe seleccionar el Tipo de Comprobante de Referencia",
        showConfirmButton: false,
        timer: 5000
      })  
      return false;
    }

    if (!datosReferencia || !datosReferencia.serieDocumento) { 
      Swal.fire({
        icon: "error",
        title: "Debe ingresar la Serie del Comprobante de Referencia",
        showConfirmButton: false,
        timer: 5000
      })  
      return false;
    }
    if (!datosReferencia || !datosReferencia.numeroDocumento) { 
      Swal.fire({
        icon: "error",
        title: "Debe ingresar el Número del Comprobante de Referencia",
        showConfirmButton: false,
        timer: 5000
      })  
      return false;
    }


    if (!datosReferencia || !datosReferencia.fechaCpeRef) { 
      Swal.fire({
        icon: "error",
        title: "Debe ingresar la Fecha del Comprobante de Referencia",
        showConfirmButton: false,
        timer: 5000
      })  
      return false;
    }
    if (!datosReferencia || !datosReferencia.tipoNotaCredito) { 
      Swal.fire({
        icon: "error",
        title: "Debe seleccionar el Tipo de Nota de Crédito",
        showConfirmButton: false,
        timer: 5000
      })  
      return false;
    }
    if (!datosReferencia || !datosReferencia.descripcion) { 
      Swal.fire({
        icon: "error",
        title: "Debe ingresar el Motivo de la Nota de Crédito",
        showConfirmButton: false,
        timer: 5000
      })  
      return false;
    }



    if (!datosItem || datosItem.length == 0)  { 
      Swal.fire({
        icon: "error",
        title: "Debe agregar al menos un ítem",
        showConfirmButton: false,
        timer: 5000
      }) 
      return false;
    }
   

    let factura = {
        datosCpe,
        datosEmisor:{
          tipoDocumento : 6,
          rucEmisor: currentEmisor.rucEmisor
        },
        datosReceptor,
        datosReferencia,
        datosItem,
        datosTotales
    }
    

    const cpe = await CreateCpe(factura);

    if (cpe.indicador == true) {
      Swal.fire({
        icon: "success",
        title: cpe.message,
        showConfirmButton: false,
        timer: 5000
      })  
    } else {
      Swal.fire({
        icon: "error",
        title: cpe.message,
        showConfirmButton: false,
        timer: 5000
      })  
    } 

  }

    return (
    <>  
        <Outlet /> 
        <PageTitle breadcrumbs={profileBreadCrumbs}>Emision de Factura Electrónica</PageTitle>   

        {
          !dataSerie ?
          (

            <h3 className='text-muted mt-1 fw-semibold'>No existe una serie asignada para este Emisor</h3>

          )
          :
          (
 
            <>
                <DatosEmisor tipoCpe="NOTA DE CRÉDITO"/>
                <DatosEmision tipoCpe="07"/>
                <DatosReceptor tipoDocumento="6"/>
                <DatosReferencia /> 
                <DatosDetalle /> 
                <DatosTotales />
        
                <form onSubmit={handleSubmit(manejarSubmit)}>
                
                  <div className='fs-4 text-gray-800 d-flex justify-content-end mt-4'>
                    <label className='d-flex align-items-center form-label mb-3 invisible'>
                      .
                    </label>
                    <button type="submit" className="btn btn-dark mb-1 w-250px">Emitir</button>
                  </div>   
        
                </form>
             </>

          )

        }
  


    </>
    )
  }
export default NotaCreditoPage