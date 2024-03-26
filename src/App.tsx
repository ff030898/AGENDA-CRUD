import { Header } from './components/Header';
import { ContactList } from './components/ContactList';
import { ContactContextProvider } from './hooks/useContacts';
import '../styles/globals.scss';
import { ButtonCreate } from './components/ui/Button/Button';
import { useState } from 'react';
import { CreateModal } from './components/CreateModal';


function App() {

  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);

  function handleOpenNewTransactionModal() {
    setIsNewTransactionModalOpen(true);
  }

  function handleCloseNewTransactionModal() {
    setIsNewTransactionModalOpen(false);
   
  }


  return (
    <ContactContextProvider>

        <Header />
        <ButtonCreate onOpenNewContactModal={handleOpenNewTransactionModal} />
        <CreateModal
          isOpen={isNewTransactionModalOpen}
          onRequestClose={handleCloseNewTransactionModal}
        />
        
        <ContactList />
    </ContactContextProvider>
  )
}

export default App
