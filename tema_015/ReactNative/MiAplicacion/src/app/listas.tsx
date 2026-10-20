import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  SectionList,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Producto, useFavoritosStore } from '@/store/favoritos';

const PRODUCTOS: Producto[] = [
  { id: '1', nombre: 'Destornillador preciso', precio: 9.99, categoria: 'herramientas' },
  { id: '2', nombre: 'Juego de llaves allen', precio: 14.5, categoria: 'herramientas' },
  { id: '3', nombre: 'Multímetro digital', precio: 29.9, categoria: 'herramientas' },
  { id: '4', nombre: 'Guantes de trabajo', precio: 7.25, categoria: 'accesorios' },
  { id: '5', nombre: 'Gafas de protección', precio: 5.5, categoria: 'accesorios' },
  { id: '6', nombre: 'Cinta aislante', precio: 3.1, categoria: 'accesorios' },
  { id: '7', nombre: 'Alicates de punta', precio: 11.0, categoria: 'herramientas' },
  { id: '8', nombre: 'Linterna frontal', precio: 16.75, categoria: 'accesorios' },
];

function agruparPorCategoria(productos: Producto[]) {
  const grupos = new Map<string, Producto[]>();
  for (const p of productos) {
    const lista = grupos.get(p.categoria) ?? [];
    lista.push(p);
    grupos.set(p.categoria, lista);
  }
  return [...grupos.entries()].map(([titulo, data]) => ({ title: titulo, data }));
}

function FilaProducto({ producto }: { producto: Producto }) {
  const theme = useTheme();
  const esFav = useFavoritosStore((s) => s.esFavorito(producto.id));
  const alternar = useFavoritosStore((s) => s.alternar);

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/detalle/[id]', params: { id: producto.id } })}
      style={({ pressed }) => [styles.fila, pressed && { backgroundColor: theme.backgroundElement }]}>
      <View style={styles.filaContenido}>
        <ThemedText type="default">{producto.nombre}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {producto.categoria} · {producto.precio.toFixed(2)} €
        </ThemedText>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={esFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        onPress={() => alternar(producto)}
        hitSlop={8}>
        <ThemedText type="title" style={styles.estrella}>
          {esFav ? '★' : '☆'}
        </ThemedText>
      </Pressable>
    </Pressable>
  );
}

export default function ListasScreen() {
  const [verSecciones, setVerSecciones] = useState(false);
  const favoritos = useFavoritosStore((s) => s.favoritos);
  const secciones = useMemo(() => agruparPorCategoria(PRODUCTOS), []);

  const cabecera = (
    <ThemedView style={styles.cabecera}>
      <ThemedText type="subtitle">Listas</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        FlatList y SectionList con virtualización (Unidad 02). Favoritos con
        Zustand (Unidad 04). Toca un producto para ver el detalle en el Stack.
      </ThemedText>
      <View style={styles.switchRow}>
        <ThemedText type="small">Ver como SectionList</ThemedText>
        <Switch value={verSecciones} onValueChange={setVerSecciones} />
      </View>
      <ThemedText type="small" themeColor="textSecondary">
        Favoritos en el store: {favoritos.length}
      </ThemedText>
    </ThemedView>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ThemedView style={styles.container}>
        {verSecciones ? (
          <SectionList
            sections={secciones}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <FilaProducto producto={item} />}
            renderSectionHeader={({ section }) => (
              <ThemedView type="backgroundElement" style={styles.seccionHeader}>
                <ThemedText type="smallBold">{section.title}</ThemedText>
              </ThemedView>
            )}
            ListHeaderComponent={cabecera}
            ItemSeparatorComponent={() => <View style={styles.separador} />}
            contentContainerStyle={styles.listaContent}
          />
        ) : (
          <FlatList
            data={PRODUCTOS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <FilaProducto producto={item} />}
            ListHeaderComponent={cabecera}
            ItemSeparatorComponent={() => <View style={styles.separador} />}
            contentContainerStyle={styles.listaContent}
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  listaContent: { paddingBottom: Spacing.six },
  cabecera: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
  },
  filaContenido: { flex: 1, gap: 2 },
  estrella: { fontSize: 22 },
  separador: { height: StyleSheet.hairlineWidth, opacity: 0.3 },
  seccionHeader: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
});
