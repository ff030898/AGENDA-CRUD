import styles from './styles.module.scss';
import { useContact } from '../../hooks/useContacts';
import { EditModal } from '../EditModal';
import { useState } from 'react';
import { BsArchiveFill, BsFillPencilFill } from "react-icons/bs";
import Select from '../Select';


export function ContactList() {

    const { contacts, deleteContact, listTodo } = useContact();
    const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];


    const [isEditTransactionModalOpen, setIsEditTransactionModalOpen] = useState(false);

    const [category, setCategory] = useState('');
    const [sort, setSort] = useState('');


    async function handleOpenEditTransactionModal(data: any) {
        await listTodo("", "", data.id)
        setIsEditTransactionModalOpen(true);
    }

    function handleCloseEditTransactionModal() {
        setIsEditTransactionModalOpen(false);
    }

    function handleDeleteContact(id: string) {
        let text = "Tem certeza que deseja excluir este contato? ";
        if (confirm(text) == true) {
            deleteContact(id);
        }
    }

    async function handleFilter(data: string, type: string) {
        if(type === 'category'){
            await listTodo(data, sort, "")
        }else if(type === 'sort'){
           //Filter aqui
        }else {
            await listTodo(category, data, "")
        }

        
    }


    return (

        <>
            <EditModal
                isOpen={isEditTransactionModalOpen}
                onRequestClose={handleCloseEditTransactionModal}
            />

            <div className={styles.contactListContainer}>

                <header>
                    <div>
                        <Select
                            name="subject"
                            label="Agrupar por:"
                            value={category}
                            onChange={(e) => { setCategory(e.target.value), handleFilter(e.target.value, 'category') }}
                            options={[
                                { value: "", label: "Todos" },
                                { value: "Familia", label: "Familia" },
                                { value: "Amigos", label: "Amigos" },
                                { value: "Parentes", label: "Parentes" },
                                { value: "Trabalho", label: "Trabalho" },

                            ]}
                        />

                        <Select
                            name="subject"
                            label="Ordem Alfabética:"
                            value={sort}
                            onChange={(e) => { setSort(e.target.value), handleFilter(e.target.value, 'sort') }}
                            options =
                                {alphabet.map((item: any) => {
                                    return {
                                        value: item, 
                                        label: item,
                                    };
                                })}
                            
                        />


                    </div>
                    <div>
                        <label htmlFor="search">Pesquisar: </label>
                        <input 
                         onChange={(e) => {handleFilter(e.target.value, 'search') }}
                        type="text" 
                        name="search" 
                        id="search" 
                        className='search' 
                        placeholder='Pesquisar' />
                    </div>
                </header>

                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Tel. Principal</th>
                            <th>Tel. Casa</th>
                            <th>Tel. Trabalho</th>
                            <th>Grupo</th>
                            <th>Data de Cadastro</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((contact: any) => {
                            return (
                                <tr key={contact.id}>
                                    <td>{contact.name}</td>
                                    <td>{contact.telP}</td>
                                    <td>{contact.telC}</td>
                                    <td>{contact.telT}</td>
                                    <td>{contact.category}</td>
                                    <td>{new Intl.DateTimeFormat('pt-BR').format(new Date(contact.createdAt))}</td>
                                    <td><button type='button' onClick={() => handleOpenEditTransactionModal(contact)}><BsFillPencilFill className="ml-4" size={20} /></button> <button type='button' onClick={() => handleDeleteContact(contact.id)}><BsArchiveFill className="ml-4" size={20} /></button></td>

                                </tr>
                            );
                        })}

                    </tbody>


                </table>




            </div>
        </>
    )
}