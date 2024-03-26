import { FormEvent, useState } from 'react';
import styles from './styles.module.scss';
import closeImage from "../../assets/close.svg";
import Modal from "react-modal";
import { useContact } from '../../hooks/useContacts';
import { v4 as uuidv4 } from 'uuid';
import * as yup from "yup";
import InputMask from 'react-input-mask';
import Select from '../ui/Select';


interface NewContactModalOpen {
    isOpen: boolean;
    onRequestClose: () => void;
}


export function CreateModal({ isOpen, onRequestClose }: NewContactModalOpen) {

    const { createContact } = useContact();
    const mask = "(99) 99999-9999";

    const [name, setName] = useState('');
    const [telP, setTelP] = useState('');
    const [telC, setTelC] = useState('');
    const [telT, setTelT] = useState('');
    const [category, setCategory] = useState('');
    const [errors, setErrors] = useState('');

    function handleCreateNewContact(event: FormEvent) {

        setErrors('')

        let data = {
            id: uuidv4(),
            name,
            telP,
            telC,
            telT,
            category,
            createdAt: new Date()
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

                    createContact(data);
                    setName('');
                    setTelP('');
                    setTelC('');
                    setTelT('');
                    setCategory('');
                    alert("Cadastro realizado com sucesso!");
                    onRequestClose();
                    setErrors('')
                } else {
                    event.preventDefault();
                    alert("Preencha todos os campos corretamente!");
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

                <h2>Cadastrar Contato</h2>
                <button type="button" onClick={onRequestClose}>
                    <img src={closeImage} alt="Fechar" className="react-modal-close" />
                </button>
                <form className={styles.modalContainer} onSubmit={handleCreateNewContact}>
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
                        label=""
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        options={[
                            { value: "Familia", label: "Familia" },
                            { value: "Amigos", label: "Amigos" },
                            { value: "Parentes", label: "Parentes" },
                            { value: "Trabalho", label: "Trabalho" },

                        ]}
                    />
                    <button type="submit">Cadastrar</button>

                    <p className='errors-text'>{errors}</p>
                </form>
            </Modal>
    )
}