import styles from './styles.module.scss';

interface ButtonProps {
    onOpenNewContactModal: () => void;
}


export function ButtonCreate(props: ButtonProps) {
    return (

        <button className={styles.buttonContainer} type="button" onClick={props.onOpenNewContactModal}>
            Novo contato
        </button>

    )
}