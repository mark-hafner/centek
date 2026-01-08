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
    marginTop: "50%",
    flexDirection: "column",
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    height: "40%"
  },
  textInputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: "75%",
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: '#000',
    borderWidth: 2,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
  },

  // BUTTON
  buttonContainer: {
    width: "60%",
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  button: {
    backgroundColor: "#00aff5ff",
    borderRadius: 16,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: "10%"
  },

  // DROPDOWN
  // Container za screens
  dropdownContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    width: "100%",
  },
  dropdown: {
    height: 50,
    width: "75%",
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 20,
  },
  placeholderStyle: {
    fontSize: 16,
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

  // DATETIME PICKER
  dateTimePickerContainer: {
    // flex: 1,
    flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "flex-end"
  },
  dateTimePickerStyle: {
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

  // TABLE COMPONENTS
  rowHeader: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 4,
    width: 1000,
  },

  row: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderColor: '#eee',
    width: "100%",
    backgroundColor: "#fff"
  },

  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 12,
  },

  cell: {
    flex: 1,
    fontSize: 12,
  },
});
