import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 10,
  },
  post: {
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#f8f8f8",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  caption: {
    fontSize: 16,
    marginVertical: 5,
  },
  comment: {
    fontSize: 14,
    color: "#555",
    marginVertical: 2,
  },
  commentContainer: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export default styles;
