import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Image,
  Link,
  Text,
} from "@chakra-ui/react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useParams } from "react-router-dom";
import {
  deliverOrder,
  getOrderDetails,
  payOrder,
} from "../actions/orderActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  ORDER_DELIVER_RESET,
  ORDER_PAY_RESET,
} from "../constants/orderConstants";

const OrderScreen = () => {
  const dispatch = useDispatch();

  const { id: orderId } = useParams();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  if (!loading) {
    order.itemsPrice = order.orderItems.reduce(
      (acc, currVal) => acc + currVal.price * +currVal.qty,
      0
    );
  }

  useEffect(() => {
    dispatch({ type: ORDER_PAY_RESET });
    dispatch({ type: ORDER_DELIVER_RESET });

    if (!order.orderItems.length > 0 || successPay || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, orderId, order, successPay, successDeliver]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => dispatch(deliverOrder(order));

  return loading ? (
    <Loader />
  ) : error ? (
    <Message type="error">{error}</Message>
  ) : (
    <>
      <Flex
        w={["xs", "sm", "md", "xl", "4xl"]}
        // py="5"
        // px="8"
        flexDirection="row"
      >
        <Grid
          templateColumns={{
            sm: "1fr",
            md: "repeat(1, 1fr)",
            lg: "repeat(2, 1fr)",
            xl: "repeat(2, 1fr)",
          }}
          alignItems="center"
          // py="5"
          // px="2"
          justifyContent="space-evenly"
          gap={[10, 20, 80]}
        >
          {/* Column 1 */}
          <Flex direction="column">
            {/* Shipping */}
            <Box
              borderBottom="1px"
              py="6"
              borderColor="gray.300"
              // w={["xs", "sm", "md", "xl", "lg"]}
              px="2"
            >
              <Heading
                as="h2"
                mb="3"
                fontSize={["lg", "xl", "2xl"]}
                fontWeight="semibold"
              >
                Shipping
              </Heading>
              <Text fontSize={["xs", "sm", "md", "lg"]}>
                Name: <strong>{order.user.name}</strong>
              </Text>
              <Text fontSize={["xs", "sm", "md", "lg"]}>
                Email:{" "}
                <strong>
                  <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                </strong>
              </Text>
              <Text fontSize={["xs", "sm", "md", "lg"]}>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </Text>
              <Text mt="4" fontSize={["xs", "sm", "md", "lg"]}>
                {order.isDelivered ? (
                  <Message type="success">
                    Delivered on {order.deliveredAt}
                  </Message>
                ) : (
                  <Message type="warning">Not Delivered</Message>
                )}
              </Text>
            </Box>

            {/* Payment Method */}
            <Box
              borderBottom="1px"
              py="6"
              borderColor="gray.300"
              // w={["xs", "sm", "md", "xl", "lg"]}
            >
              <Heading
                as="h2"
                mb="3"
                fontSize={["lg", "xl", "2xl"]}
                fontWeight="semibold"
              >
                Payment Method
              </Heading>
              <Text fontSize={["xs", "sm", "md", "lg"]}>
                <strong>Method: </strong>
                {order.paymentMethod?.toUpperCase()}
              </Text>
              <Text mt="4" fontSize={["xs", "sm", "md", "lg"]}>
                {order.isPaid ? (
                  <Message type="success">
                    Paid on {new Date(order.paidAt).toUTCString()}
                  </Message>
                ) : (
                  <Message type="warning">Not Paid</Message>
                )}
              </Text>
            </Box>

            {/* Order Items */}
            <Box
              borderBottom="1px"
              py="6"
              borderColor="gray.300"
              w={["xs", "sm", "md", "xl", "lg"]}
            >
              <Heading
                as="h2"
                mb="3"
                fontSize={["md", "lg", "xl", "2xl"]}
                fontWeight="semibold"
              >
                Order Items
              </Heading>
              <Box>
                {order.orderItems.length === 0 ? (
                  <Message>No Order Info</Message>
                ) : (
                  <Box py="2" w={["xs", "sm", "md", "xl", "lg"]}>
                    {order.orderItems.map((item, idx) => (
                      <Flex
                        key={idx}
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Flex
                          py="2"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            w="12"
                            h="12"
                            objectFit="cover"
                            mr="6"
                          />
                          <Link
                            fontWeight="bold"
                            fontSize={["xs", "sm", "md", "xl", "lg"]}
                            as={RouterLink}
                            to={`/products/${item.product}`}
                            justifyContent="flex-start"
                            gap="40"
                          >
                            {item.name}
                          </Link>
                        </Flex>

                        <Text
                          fontSize={["xs", "sm", "md", "lg"]}
                          fontWeight="semibold"
                        >
                          {+item.qty * item.price}
                        </Text>
                      </Flex>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </Flex>

          {/* Column 2 */}
          <Flex
            direction="column"
            bgColor="white"
            justifyContent="space-between"
            py="8"
            px="5"
            shadow="md"
            rounded="lg"
            borderColor="gray.300"
            w={["xs", "sm", "md", "lg"]}
          >
            <Box>
              <Heading
                mb="6"
                as="h2"
                fontSize={["xs", "md", "lg", "xl"]}
                fontWeight="bold"
              >
                Order Summary
              </Heading>

              {/* Items Price */}
              <Flex
                borderBottom="1px"
                py="2"
                borderColor="gray.200"
                alignitems="center"
                justifyContent="space-between"
              >
                <Text fontSize={["xs", "md", "lg", "xl"]}>Items</Text>
                <Text fontWeight="bold" fontSize={["xs", "md", "lg", "xl"]}>
                  ₹{order.itemsPrice}
                </Text>
              </Flex>

              {/* Shipping Price */}
              <Flex
                borderBottom="1px"
                py="2"
                borderColor="gray.200"
                alignitems="center"
                justifyContent="space-between"
              >
                <Text fontSize={["xs", "md", "lg", "xl"]}>Shipping</Text>
                <Text fontWeight="bold" fontSize={["xs", "md", "lg", "xl"]}>
                  ₹{order.shippingPrice}
                </Text>
              </Flex>

              {/* Tax Price */}
              <Flex
                borderBottom="1px"
                py="2"
                borderColor="gray.200"
                alignitems="center"
                justifyContent="space-between"
              >
                <Text fontSize={["xs", "md", "lg", "xl"]}>Tax</Text>
                <Text fontWeight="bold" fontSize={["xs", "md", "lg", "xl"]}>
                  ₹{order.taxPrice}
                </Text>
              </Flex>

              {/* Total Price */}
              <Flex
                borderBottom="1px"
                py="2"
                borderColor="gray.200"
                alignitems="center"
                justifyContent="space-between"
              >
                <Text fontSize={["xs", "md", "lg", "xl"]}>Total</Text>
                <Text fontWeight="bold" fontSize={["xs", "md", "lg", "xl"]}>
                  ₹{order.totalPrice}
                </Text>
              </Flex>
            </Box>

            {/* PAYMENT BUTTON */}
            {!order.isPaid && (
              <Box>
                {loadingPay ? (
                  <Loader />
                ) : (
                  <PayPalScriptProvider
                    options={{
                      clientId: "test",
                      components: "buttons",
                    }}
                  >
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: order.totalPrice,
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order.capture().then((details) => {
                          console.log(details);
                          const paymentResult = {
                            id: details.id,
                            status: details.status,
                            update_time: details.update_time,
                            email_address: details.payer.email_address,
                          };
                          successPaymentHandler(paymentResult);
                        });
                      }}
                    />
                  </PayPalScriptProvider>
                )}
              </Box>
            )}

            {/* Order Deliver Button */}
            {loadingDeliver && <Loader />}
            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <Button
                  type="button"
                  colorScheme="teal"
                  onClick={deliverHandler}
                >
                  Mark as delivered
                </Button>
              )}
          </Flex>
        </Grid>
      </Flex>
    </>
  );
};

export default OrderScreen;
