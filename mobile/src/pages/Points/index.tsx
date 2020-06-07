import React, { useState, useEffect } from "react";
import Constants from "expo-constants";
import { Feather as Icon } from "@expo/vector-icons";
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Alert, ActivityIndicator, Dimensions } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { SvgUri } from "react-native-svg";
import * as Location from "expo-location";
import api from "./../../services/api";

// import {  } from "";

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface Point {
  id: number;
  name: string;
  image_url: string;
  latitude: number;
  longitude: number;
}

interface Params {
  uf: string;
  city: string;
}

const Points = () => {
  const {width, height} = Dimensions.get('window');
  const [dimensions, setDimensions] = useState<[number, number]>([0, 0]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState<Boolean>(false);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as Params;


  useEffect(() => {
    setDimensions([width, height]);
    api.get('items').then(response => {
      setItems(response.data);
    }).catch(error => {
      Alert.alert("Ops", "aconteceu um probleminha")
    });
  }, []);

  useEffect(() => {
    api.get('points', {
      params: {
        city: routeParams.city,
        uf: routeParams.uf,
        items: selectedItems
      }
    }).then(response => {
      setPoints(response.data);
    }).catch(error => {
      Alert.alert("opss...", "Tivemos um probleminha ao carregar os pontos");
    });
  }, [selectedItems]);


  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert("ops...", "precisamos de sua permissão para obter sua localização");
        return;
      }

      const location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;

      setInitialPosition([latitude, longitude]);
    }
    loadPosition();
  }, []);

  function handleNavigationBack() {
    navigation.goBack();
  }

  function handleNavigationDetail(id: number) {
    navigation.navigate('Detail', { point_id: id });
  }

  function handleSelectItem(id: number) {

    const alreadySelected = selectedItems.findIndex(item => item === id);
    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id);
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

    return (
      <>
        <View style={styles.container}>
         
          
          <TouchableOpacity onPress={handleNavigationBack}>
            <Icon name="arrow-left" size={20} color="#34cd79" />
          </TouchableOpacity>

          <Text style={styles.title}>Bem vindo</Text>
          <Text style={styles.description}>Encontre no mapa um ponto de coleta</Text>

          <View style={styles.mapContainer}>
            {initialPosition[0] !== 0 && (
              <MapView style={styles.map}
                loadingEnabled={initialPosition[0] === 0}
                initialRegion={{
                  latitude: initialPosition[0],
                  longitude: initialPosition[1],
                  latitudeDelta: 0.016,
                  longitudeDelta: 0.016,
                }}
              >

                {points.map(point => (
                  <Marker key={point.id}
                    style={styles.mapMarker}
                    coordinate={{
                      latitude: point.latitude,
                      longitude: point.longitude,
                    }}
                    onPress={() => handleNavigationDetail(point.id)}
                  >
                    <View style={styles.mapMarkerContainer}>
                      <Image
                        style={styles.mapMarkerImage}
                        source={{ uri: point.image_url }} />
                      <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                    </View>
                  </Marker>
                ))}

              </MapView>
            )}
          </View>
        </View>

        <View style={styles.itemsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >

            {items.map(item => (
              <TouchableOpacity
                key={String(item.id)}
                style={[
                  styles.item,
                  selectedItems.includes(item.id) ? styles.selectedItem : {}
                ]}
                activeOpacity={0.6}
                onPress={() => handleSelectItem(item.id)}
              >
                <SvgUri width={32} height={32} uri={item.image_url} />
                <Text style={styles.title}>{item.title}</Text>
              </TouchableOpacity>
            ))}

          </ScrollView>
        </View>
      </>

    )
  // }

};

const styles = StyleSheet.create({
  containerLoading: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f34366',
    zIndex: 999,
  },
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 15 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 9,
  },
});

export default Points