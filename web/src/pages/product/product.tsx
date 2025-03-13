// import { Link } from "react-router-dom";
import { api } from "../../api";
import { formatPrice } from "../../helpers";
import { useQuery } from "../../hooks/api-call";
import styles from "./product.module.css";

export default function Product() {
  const products = useQuery({
    initialData: [],
    query: async () => (await api.fetchProducts()).data,
  });

  async function handleBuy(productId: string) {
    const url = await api.createStripeSession(productId);
    console.log(url);
    window.location.href = url.data;
  }

  return (
    <main className={styles.main}>
      <div className={styles["product-row"]}>
        {products.data.map((p) => (
          <div key={p.id} className={styles.product}>
            <p className={styles.price}>{formatPrice(p.priceInPennies)}</p>
            <div>
              <h2 className={styles.name}>{p.name}</h2>
              <p className={styles.description}>{p.description}</p>
            </div>
            {/* <Link to={p.url} className={styles["buy-btn"]}>
              Buy Now
            </Link> */}
            <button
              className={styles["buy-btn"]}
              onClick={() => handleBuy(p.id)}
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
