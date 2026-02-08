from Core.Models.ConfigModel import ConfigModel
from utilidades import config
import json
import os

class ConfigService:
    @classmethod
    def obtener_config(cls) -> ConfigModel:
        """Obtiene la configuración actual o crea una por defecto"""
        try:
            if not os.path.exists(config.CONFIG_FILE):
                default_config = cls._crear_config_default()
                cls.guardar_config(default_config)
                return default_config
                
            with open(config.CONFIG_FILE, 'r') as file:
                config_data = json.load(file)
                return ConfigModel(**config_data)
        except Exception as e:
            raise Exception(f"Error al cargar configuración: {str(e)}")

    @classmethod
    def guardar_config(cls, config_data: ConfigModel) -> bool:
        """Guarda la configuración en archivo"""
        try:
            os.makedirs(os.path.dirname(config.CONFIG_FILE), exist_ok=True)
            with open(config.CONFIG_FILE, 'w') as file:
                json_data = config_data.model_dump()
                json.dump(json_data, file, indent=4)
            return True
        except Exception as e:
            raise Exception(f"Error al guardar configuración: {str(e)}")

    @classmethod
    def obtener_estructura(cls) -> dict:
        """Obtiene la estructura del modelo de configuración"""
        return ConfigModel.model_json_schema()

    @classmethod
    def actualizar_config(cls, actualizaciones: dict) -> ConfigModel:
        """Actualiza parcialmente la configuración"""
        try:
            config_actual = cls.obtener_config()
            datos_actualizados = config_actual.model_dump()
            
            if not actualizaciones:
                return "Error: No se proporcionaron datos para actualizar"

            # Valida estructura antes de actualizar
            if 'empresa' in actualizaciones:
                datos_actualizados['empresa'].update(actualizaciones['empresa'])
            if 'tema' in actualizaciones:
                datos_actualizados['tema'].update(actualizaciones['tema'])
            
            nueva_config = ConfigModel(**datos_actualizados)
            if not cls.guardar_config(nueva_config):
                return "Error: No se pudo guardar la configuración"
                
            return nueva_config
        except Exception as e:
            raise Exception(f"Error al actualizar configuración: {str(e)}")

    @classmethod
    def restablecer_config(cls) -> ConfigModel:
        """Restablece la configuración a valores por defecto"""
        try:
            config_default = cls._crear_config_default()
            if not cls.guardar_config(config_default):
                raise Exception("No se pudo guardar la configuración por defecto")
            return config_default
        except Exception as e:
            raise Exception(f"Error al restablecer configuración: {str(e)}")

    @staticmethod
    def _crear_config_default() -> ConfigModel:
        """Crea una configuración con valores por defecto"""
        return ConfigModel(
            empresa={
                "nombre": "LavApp",
                "nit": "1234567890",
                "telefono": "6042223243",
                "direccion": "Cl 30 # 34-45",
                "iva": True,
                "valor_iva": 19.0,
                "iva_incluido": True,
                "logo": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHcAAAAfCAYAAADdnlK9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAASeSURBVHgB7VrdcdswDIZ7fa87QdQJ6g3MTNBsUHWCpBPYncDpBLE3cCawMkGcCaxM4HQCFoioC60AIOQwD7bz3fFskR/BH5AASGngvR8CwAgYDAaDCo4QOGYa71DjHMXYcaClFwBHChzaxqfh4MDxCU4MQWmFgfoDDhwnp1zETyOvhAPHKSrXGXnDQzfNJ6XcHia5xUGb5s/wjgiT+R12o/EnTDWmO4xI10ydiSDuAflLhl/izxnDr5G/6ORZTXKLC0y/NYLS3wW2X4fTCLXbzgGN/1aKxpFfAN/PJ6zzN+KU8DLuum2vKyx7tExKxbTyadz75lgS15XqrYS2NgL/pg/Xy3CJsUoY09gwbYXyjW+UxM0dyw/lV17GrCssq3Kx2tT3xzSqfylwtkxbI0Xm2DhphMLLip8kxivhp5cV22LjOwpW+knc0qexgvdQrm8maV+4IGOY4hj6vmH6dqNx8XdmldWRK2HjbViBTbnbHjKvSFbugGom5JOfmWOqQMbzDkG/8aTwvneepYCnYvKcwG39+K1QTgvWQX8URp4zyh/2kDlBmcPcyr1g8mpM31BpvzCd4/+pUDf2vUuj/JHAm8cPXo+Sn9sKAc6TwBnDfrgO7TpMa4Vnjcqpf9Mg8xc0c8uBFsI4m1n2jTkdM6kbME1S7XnZNG8jjuQCepvkvrxOHQk3zPxsU/K9HhtcdmRq3Fm2nUvmFNNdmzDrAdM/TBT0UJBEPo38y9QiC3jTShPULhYnVK+YPCv3TuDtY5p3rE8Y01zgFmDDoiOzAnn3FtnPuWESyH86eBuWggwykWuQTeUcXvenELhrvxutaqaT2qvAjkcm70Ei084OC0BCLZRTnwsmP6/P9c2Rhnang7djIeS78Mv52zpYjRjaxQX5xE2U7hVuCf2w7cn/AvtBXBDZlBt2wCTRiQpk07QDxTS70BanXJYPedDXNH9l8s4kMo73EXRI758LqULOnXsp5JPZcNj5ryFaXoAdXNTcXudxmMcPwT8XkA99omYuAnYCVzPHLaQXGSNRptdvPQpDel5RXr427EbL5ujc6xcaXXBR8sznxT3ThgSKjIuIp0W2q768wJ0q3MtUQLWBNErQd+Mw6kwBuuneAZlmrFOBzbRWTN6FwK1Bdw8joS5F/mcGE0qgca+Qv070BcDoqqBxSaSTCl7OzxJuc0bLtZC/CgoiJL9dYiBFzV3M4wevm+QlKuiPUNZG2JIySkxi3Q4KSLuFGuQjmCSzTHAqekOU0+dqu9eFRIqtweZjLHJb9I2Sl0pZ6rbKgQ2VkXf96lXd22XS7RXkvMSowKYIej9qVm7irrkFVy6aZGYhcJAWAJnGM0iDjlnrBGfavqM1QrtyJNBcle1iyXrORaElNDdQNVNcQRM1L6E/UnXm8UPCJFdgw61SVkIaNNF0OrgGvg9Ocw0cgtLOgR8D5Z3HHygM4J0QJrg9mNfGIOTgQGGpUORiCxHNx4N2ExX8PfthAtYbRDxycfSWjK5468Tt1gf2gXIU2etNknYUgp44xa8fTwYfyj1ifCj3iPGh3CPGu363fCKYCvn7ng5qMHzQYMF/TDMfb42saGoAAAAASUVORK5CYII="
            },
            tema={
                "primario": "100 80% 30%",
                "foregroundPrimario": "0 0% 100%"
            }
        )