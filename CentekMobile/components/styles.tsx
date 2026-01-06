import { LinearGradientProps } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

export const gradientStyle: LinearGradientProps = {
  colors: ['#ffd139', '#ff9100', '#ffd139'] as const,
  start: [0, 0],
  end: [1, 1],
};

export const styles = StyleSheet.create({
  // Background / gradient
  background: {
    flex: 1,
  },

  // Container za screens
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    width: "100%",
  },

  text: {
    color: '#000',
    fontSize: 18,
    marginVertical: 4,
  },
  scroll: {
    marginTop: 20,
    paddingHorizontal: 20,
  },

  // TEXT INPUT
  // Container za screens
  loginContainer: {
    flex: 1,
    paddingTop: "80%",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    width: "100%"
  },
  input: {
    height: 50,
    width: "75%",
    margin: 10,
    borderColor: '#000',
    borderWidth: 2,
    marginBottom: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
  },

  // BUTTON
  buttonContainer: {
    width: "60%",
    height: 50,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: "#00aff5ff",
    borderRadius: 16,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },

  // DROPDOWN
  // Container za screens
  dropdownContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    width: "100%",
  },
  dropdown: {
    height: 50,
    width: "70%",
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
  },
  placeholderStyle: {
    fontSize: 16,
    paddingLeft: 20
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#000",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  selectedStyle: {
    borderRadius: 12,
    backgroundColor: '#00d9ffa8',
  },

  // Loader text
  loaderText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 12,
  },

  // loader containe
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },

  // MODAL
  modalView: {
    width: "100%",
    height: "80%",
    marginTop: "20%",
    margin: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalScroll: {
    height: "100%",
    width: "100%"
  },
});
