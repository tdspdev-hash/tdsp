import styles from "@/components/member/Member.module.css";

export default function Loading() {
  return (
    <div className={styles.body} aria-busy="true">
      <div className={styles.skeleton} />
      <div className={styles.skeleton} />
    </div>
  );
}
