class CellOutputDataSerializer
  include FastJsonapi::ObjectSerializer
  set_type :data

  attributes :data
end
