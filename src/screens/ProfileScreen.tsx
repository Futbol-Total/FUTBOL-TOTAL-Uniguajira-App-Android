import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [userStats, setUserStats] = useState({
    memberSince: 'Cargando...',
    lastLogin: 'Cargando...',
  });

  useEffect(() => {
    if (user) {
      // Calcular datos reales del usuario desde Firebase
      const creationTime = user.metadata?.creationTime;
      const lastSignInTime = user.metadata?.lastSignInTime;
      
      let memberSince = 'Información no disponible';
      if (creationTime) {
        memberSince = new Date(creationTime).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long'
        });
      }
      
      let lastLogin = 'Información no disponible';
      if (lastSignInTime) {
        const lastLoginDate = new Date(lastSignInTime);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - lastLoginDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          lastLogin = 'Hoy';
        } else if (diffDays === 2) {
          lastLogin = 'Ayer';
        } else if (diffDays <= 7) {
          lastLogin = `Hace ${diffDays - 1} días`;
        } else {
          lastLogin = lastLoginDate.toLocaleDateString('es-ES');
        }
      }
      
      setUserStats({
        memberSince,
        lastLogin,
      });
    }
  }, [user]);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error: any) {
              Alert.alert('Error', 'No se pudo cerrar la sesión');
            }
          }
        },
      ]
    );
  };

  const getUserName = (email: string) => {
    return email.split('@')[0];
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.avatar}
        />
        <Text style={styles.userName}>
          {user?.email ? getUserName(user.email) : 'Usuario'}
        </Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Ionicons name="mail" size={20} color="#68cc8f" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Correo Electrónico</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="calendar" size={20} color="#68cc8f" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Miembro Desde</Text>
            <Text style={styles.infoValue}>{userStats.memberSince}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="time" size={20} color="#68cc8f" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Último Acceso</Text>
            <Text style={styles.infoValue}>{userStats.lastLogin}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={20} color="#ffffff" />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c1f',
  },
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    margin: 15,
    borderRadius: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#68cc8f',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#68cc8f',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  infoContainer: {
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    margin: 15,
    borderRadius: 15,
    padding: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoContent: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4757',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#ff4757',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});