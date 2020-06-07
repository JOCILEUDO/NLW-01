import React, { useState, useEffect } from "react";
import { AppLoading } from "expo";
import { Feather as Icon } from "@expo/vector-icons";
import { View, Image, StyleSheet, Text, ImageBackground, TextInput, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import Axios from "axios";

import { Ubuntu_700Bold, useFonts } from "@expo-google-fonts/ubuntu";
import { Roboto_400Regular, Roboto_500Medium } from "@expo-google-fonts/roboto";

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

interface UfItem {
  label: string;
  value: string;
}

interface CitysItem {
  label: string;
  value: string;
}

const Home = () => {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    Roboto_400Regular, Roboto_500Medium, Ubuntu_700Bold
  });
  const [uf, setUf] = useState('');
  const [ufInitials, setUfInitials] = useState<UfItem[]>([]);
  const [city, setCity] = useState('');
  const [citys, setCitys] = useState<CitysItem[]>([]);

  useEffect(() => {
    Axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        const ufInitials = response.data.map(uf => uf.sigla);
        const serialezedUfs = ufInitials.map(uf => {
          return {
            label: uf,
            value: uf
          }
        });

        setUfInitials(serialezedUfs);
      });
  }, []);

  useEffect(() => {
    if (!uf) {
      return;
    }

    Axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
      .then(response => {
        const serialezedItems = response.data.map(city => {
          return {
            label: city.nome,
            value: city.nome
          }
        });

        setCitys(serialezedItems);
      });

  }, [uf]);

  if (!fontsLoaded) {
    return <AppLoading />
  }

  function handleNavigationToPoints() {
    if (!uf) {
      Alert.alert('Opss...', 'Selecione um estado');
      return;
    }

    if (!city) {
      Alert.alert('Opss...', 'Selecione uma cidade');
      return;
    }
    
    navigation.navigate('Points', {
      uf,
      city
    });
  }

  function handleUfSelected(uf: string) {
    setUf(uf);
  }

  function handleCitySelected(city: string) {
    setCity(city);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >

      <ImageBackground
        source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >

        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrar pontos de coleta de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>

          <RNPickerSelect
            onValueChange={(value) => handleUfSelected(value)}
            placeholder={{
              label: 'Selecione um estado',
              value: null,
            }}
            items={ufInitials}
          />

          <RNPickerSelect
            onValueChange={(value) => handleCitySelected(value)}
            placeholder={{
              label: 'Selecione uma cidade',
              value: null,
            }}
            items={citys}
          />


          <RectButton
            style={styles.button}
            onPress={handleNavigationToPoints}
          >

            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#fff" size={24} />
              </Text>
            </View>

            <Text style={styles.buttonText}>
              Entrar
            </Text>

          </RectButton>
        </View>

      </ImageBackground>
    </KeyboardAvoidingView>
  )
};

const styles = StyleSheet.create({
  select: {
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 2,
  },
  container: {
    flex: 1,
    padding: 32,
    alignItems: 'center'
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },
  footer: {},
  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    width: 180,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;