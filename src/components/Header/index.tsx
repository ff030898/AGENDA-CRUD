import styles from './styles.module.scss';

export function Header() {
    return (

        <header className={styles.headerContainer}>
            <h1>CRUD</h1>
            <p>Lista de Contatos</p>
        </header>

    )
}