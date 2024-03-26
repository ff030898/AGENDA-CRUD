import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

type Contact = {
  id: string;
  name: string;
  telP: string;
  telC: string;
  telT: string;
  category: string;
  createdAt: Date;
}
type ContactContextData = {
  contacts: Contact[];
  contactEdit: any;
  validateCreate: boolean;
  listUserId: (id: string) => Promise<void>;
  createContact: (transaction: Contact) => Promise<void>;
  editContact: (transaction: Contact) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  listTodo: (category: string, search: string, sort: string) => Promise<void>;
}

type ContactInput = Omit<Contact, 'id' | 'createdAt'>

type ContactContextProviderProps = {
  children: ReactNode;
}

export const ContactContext = createContext({} as ContactContextData);

export function ContactContextProvider({ children }: ContactContextProviderProps) {

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [validateCreate, setValidateCreate] = useState(false);
  const [contactEdit, setContactEdit] = useState<any>();

  async function listTodo(category: string, search: string, sort: string) {
    
    const resp = await api.get(`/contacts?${category && 'category=' + category}${search && '&name_like=' + search}`)

    if (sort) {
      const filter = resp.data.filter((contact: Contact) => {
        return (contact.name.substring(0, 1)) === sort
      })

      setContacts(filter)
    } else {
      setContacts(resp.data)
    }

  }

  useEffect(() => {

    listTodo('', '', '');

  }, []);

  async function listUserId(id: string) {
    await api.get(`/contacts?id=${id}`)
      .then(response => setContactEdit(response.data))
  }

  async function createContact(transactionInput: ContactInput) {
    await api.post('/contacts', transactionInput)
      .then(() => setValidateCreate(true))
      .catch(() => setValidateCreate(false))
    listTodo('', '', '');
  }

  async function editContact(transactionInput: Contact) {
    await api.put(`/contacts/${transactionInput.id}`, transactionInput)
    listTodo('', '', '');
  }

  async function deleteContact(id: string) {
    await api.delete(`/contacts/${id}`)
    listTodo('', '', '');
  }



  return (
    <ContactContext.Provider value={{ contacts, validateCreate, contactEdit, listTodo, listUserId, createContact, editContact, deleteContact }}>
      {children}
    </ContactContext.Provider>
  )

}

export const useContact = () => {
  return useContext(ContactContext);
}

