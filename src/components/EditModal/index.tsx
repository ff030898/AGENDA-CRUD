import { FormEvent, useEffect, useState } from 'react';
import styles from './styles.module.scss';
import closeImage from "../../assets/close.svg";
import Modal from "react-modal";
import { useContact } from '../../hooks/useContacts';
import * as yup from "yup";
import InputMask from 'react-input-mask';
import Select from '../Select';


interface NewContactModalOpen {
    isOpen: boolean;
    onRequestClose: () => void;
}


export function EditModal({ isOpen, onRequestClose }: NewContactModalOpen) {

    const mask = "(99) 99999-9999";
    const { editContact, contactEdit } = useContact();

    const [id, setID] = useState('');
    const [name, setName] = useState('');
    const [telP, setTelP] = useState('');
    const [telC, setTelC] = useState('');
    const [telT, setTelT] = useState('');
    const [category, setCategory] = useState('');
    const [createdAt, setCreatedAt] = useState(new Date());
    const [errors, setErrors] = useState('');

    function listEdit() {

        if(contactEdit?.length > 0){
            let {id, name, telP, telC, telT, category} = contactEdit[0]
            setID(id)
            setName(name)
            setTelP(telP)
            setTelC(telC)
            setTelT(telT)
            setCategory(category)
        }
       
    }

    useEffect(() => {
        listEdit()
    }, [contactEdit])


    function handleEditNewContact(event: FormEvent) {

        let data = {
            id,
            name,
            telP,
            telC,
            telT,
            category,
            createdAt
        }

        let schema = yup.object().shape({
            name: yup.string().required(),
            telP: yup.string().required(),
            telC: yup.string().required(),
            telT: yup.string().required(),
            category: yup.string().required(),
        });

        schema
            .isValid(data)
            .then((valid) => {

                if ((valid) && telP.length > 14 && telC.length > 14 && telT.length > 14) {
                    event.preventDefault();
                    editContact(data);
                    setID('');
                    setName('');
                    setTelP('');
                    setTelC('');
                    setTelT('');
                    setCategory('');
                    setCreatedAt(new Date());
                    onRequestClose();
                } else {
                    setErrors('Preencha todos os campos corretamente*')
                }

            });

    }


    return (

        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className={"react-modal-content"}>

            <h2>Editar Contato</h2>
            <button type="button" onClick={onRequestClose}>
                <img src={closeImage} alt="Fechar" className="react-modal-close" />
            </button>
            <form className={styles.modalContainer} onSubmit={handleEditNewContact}>

                <input placeholder="Nome" value={name} onChange={event => setName(event.target.value)} />

                <InputMask
                    mask={mask}
                    placeholder="Telefone Principal"
                    onChange={event => {

                        setTelP(event.target.value)
                    }
                    }
                    value={telP}
                >
                </InputMask>

                <InputMask
                    mask={mask}
                    placeholder="Telefone Casa"
                    type="text" value={telC}
                    onChange={event => setTelC(event.target.value)}
                >
                </InputMask>

                <InputMask
                    mask={mask}
                    placeholder="Telefone Trabalho"
                    type="text" value={telT}
                    onChange={event => setTelT(event.target.value)}
                >
                </InputMask>

                <Select
                    name="subject"
                    label="Grupo"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    options={[
                        { value: "Familia", label: "Familia" },
                        { value: "Amigos", label: "Amigos" },
                        { value: "Parentes", label: "Parentes" },
                        { value: "Trabalho", label: "Trabalho" },

                    ]}
                />

                <button type="submit">Salvar</button>
                <p className='errors-text'>{errors}</p>
            </form>
        </Modal>

    )
}