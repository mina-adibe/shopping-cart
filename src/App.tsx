import { useEffect, useState } from "react";

//component
import Item from "./Item/Item";
import Drawer from "@material-ui/core/Drawer";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import Cart from "./Cart/Cart";
import Badge from "@material-ui/core/Badge";
//Styles
import { Wrapper, StyledButton } from "./App.styles";

//Types
export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
};

const App = () => {
  const [data, setdata] = useState([] as CartItemType[]);
  const [isLoading, setIsLoading] = useState<boolean>();
  const [error, setError] = useState<boolean>();
  useEffect(() => {
    try {
      const getProductss = async (): Promise<CartItemType[]> =>
        await (await fetch("http://fakestoreapi.com/products")).json().then((res) => {
          setIsLoading(true);
          setdata(res);
          setIsLoading(false);
          return res;
        });
      getProductss();
    } catch (error) {
      setError(true);
    }
  }, []);

  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as CartItemType[]);

  const getTotalItems = (items: CartItemType[]) =>
    items.reduce((ack: number, items) => ack + items.amount, 0);
  const handleAddtoCart = (clickedItem: CartItemType) => {
    setCartItems((prev) => {
      //1. Is the item already added in the cart?
      const isItemInCart = prev.find((item) => item.id === clickedItem.id);
      if (isItemInCart) {
        return prev.map((item) =>
          item.id === clickedItem.id ? { ...item, amount: item.amount + 1 } : item
        );
      }
      //First timem the item is added
      return [...prev, { ...clickedItem, amount: 1 }];
    });
  };
  const handleRemoveFromCart = (id: number) => {
    setCartItems((prev) =>
      prev.reduce((ack, item) => {
        if (item.id === id) {
          if (item.amount === 1) return ack;
          return [...ack, { ...item, amount: item.amount - 1 }];
        } else {
          return [...ack, item];
        }
      }, [] as CartItemType[])
    );
  };

  if (isLoading) return <LinearProgress />;
  if (error) return <div>Somthing went wrong!</div>;
  return (
    <Wrapper>
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart
          cartItems={cartItems}
          addToCart={handleAddtoCart}
          removeFromCart={handleRemoveFromCart}
        />
      </Drawer>
      <StyledButton onClick={() => setCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color="error">
          <AddShoppingCartIcon />
        </Badge>
      </StyledButton>

      <Grid container spacing={3}>
        {data?.map((item) => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddtoCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
};

export default App;
