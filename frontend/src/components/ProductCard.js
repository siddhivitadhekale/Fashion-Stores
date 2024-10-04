import { Box, Flex, Heading, Image, Link, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import Rating from "./Rating";

const ProductCard = ({ product }) => {
  return (
    <Link
      as={RouterLink}
      to={`/product/${product._id}`}
      _hover={{ textDecor: "none" }}
    >
      <Box borderRadius="lg" bgColor="white" _hover={{ shadow: "md" }} w="full">
        <Image
          src={product.image}
          alt={product.name}
          w={["md", "lg", "xl"]}
          h={["xs", "sm", "md"]}
          objectFit="fill"
          borderTopLeftRadius="lg"
          borderTopRightRadius="lg"
        />
        <Flex py="5" px="4" direction="column" justifyContent="space-between">
          <Heading as="h4" fontSize={["sm", "md", "lg"]} mb="3">
            {product.name}
          </Heading>
          <Flex alignItems="center" justifyContent="space-between">
            <Rating color="yellow.500" value={product.rating} />
            <Text
              fontSize={["sm", "md", "lg", "xl"]}
              fontWeight="bold"
              color="blue.600"
            >
              ₹{product.price}
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Link>
  );
};

export default ProductCard;
