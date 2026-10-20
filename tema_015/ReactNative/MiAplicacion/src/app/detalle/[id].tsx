import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useFavoritosStore } from '@/store/favoritos';

export default function DetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const favoritos = useFavoritosStore((s) => s.favoritos);
  const producto = favoritos.find((f) => f.id === id);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: `Detalle #${id}` }} />
      <View style={styles.contenido}>
        <ThemedText type="subtitle">Producto {id}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Pantalla apilada con ruta dinámica <ThemedText type="code">detalle/[id]</ThemedText>{' '}
          (Unidad 03 — Navegación Stack).
        </ThemedText>
        {producto ? (
          <ThemedText type="default">
            {producto.nombre} — {producto.precio.toFixed(2)} € ({producto.categoria})
          </ThemedText>
        ) : (
          <ThemedText type="default" themeColor="textSecondary">
            Este producto no está en tu lista de favoritos del store de Zustand.
          </ThemedText>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contenido: {
    gap: Spacing.three,
    padding: Spacing.four,
  },
});
