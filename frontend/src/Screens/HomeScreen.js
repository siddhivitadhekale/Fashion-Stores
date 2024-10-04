import { Heading, Box, Grid } from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import ProductCard from "../components/ProductCard";
import ImageSlider from "../components/ImageSlider";

const HomeScreen = () => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  return (
    <>
      <Box h={{ base: "200px", sm: "200px" }} w={{ base: "100%", sm: "100" }}>
        <ImageSlider />
      </Box>
      <Heading
        as="h2"
        mb="8"
        fontSize="2xl"
        mt={{ base: "10", sm: "35", md: "60" }}
        textAlign="center"
        textDecoration="underline"
      >
        Latest Products
      </Heading>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message type="error">{error}</Message>
      ) : (
        <Grid
          templateColumns={{
            base: "repeat(1,1fr)",
            sm: "repeat(2,1fr)",
            md: "repeat(3,2fr)",
            lg: "repeat(4,1fr)",
            "2xl": "repeat(5,2fr)",
          }}
          gap={8}
        >
          {" "}
          {products.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </Grid>
      )}
    </>
  );
};

export default HomeScreen;
