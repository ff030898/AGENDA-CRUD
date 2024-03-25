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
  listUserId: (id: string) => Promise<void>;
  createContact: (transaction: Contact) => Promise<void>;
  editContact: (transaction: Contact) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  listTodo: (category: string, sort: string, idEdit: string) => Promise<void>;
}

type ContactInput = Omit<Contact, 'id' | 'createdAt'>

type ContactContextProviderProps = {
  children: ReactNode;
}

export const ContactContext = createContext({} as ContactContextData);

export function ContactContextProvider({ children }: ContactContextProviderProps) {

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactEdit, setContactEdit] = useState<any>();
  async function listTodo(category: string, sort: string) {
      await api.get(`/contacts?${category && 'category=' + category}${sort && '&name_like=' + sort}`)
      .then(response => setContacts(response.data))
  }

  useEffect(() => {

    listTodo('', '');

  }, []);

  async function listUserId(id: string) {
    await api.get(`/contacts?id=${id}`)
    .then(response => setContactEdit(response.data))
}

  async function createContact(transactionInput: ContactInput) {
    await api.post('/contacts', transactionInput)
    listTodo('', '');
  }

  async function editContact(transactionInput: Contact) {
    await api.put(`/contacts/${transactionInput.id}`, transactionInput)
    listTodo('', '');
  }

  async function deleteContact(id: string) {
    await api.delete(`/contacts/${id}`)
    listTodo('', '');
  }



  return (
    <ContactContext.Provider value={{ contacts, listTodo, contactEdit, listUserId, createContact, editContact, deleteContact }}>
      {children}
    </ContactContext.Provider>
  )

}

export const useContact = () => {
  return useContext(ContactContext);
}

